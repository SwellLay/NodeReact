import React, { Component } from 'react'
import { Input, Label, Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators, Progress,
CarouselCaption } from 'reactstrap';
import { ChromePicker } from 'react-color';
import { fetchSalesSetting, addSalesSetting } from '../../../../../api/SettingService';
import { invoiceSettingPayload } from '../../setting/components/supportFunctionality/helper';
import { fetchSignedUrl, uploadImage, updateCompany } from '../../../../../api/businessService';
import { connect } from 'react-redux';
import { setUserSettings } from '../../../../../actions/loginAction';
import { setSelectedBussiness } from '../../../../../actions/businessAction';
import history from '../../../../../customHistory';

const items = [
    'https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-nextcontemporary--06-14-16.png',
    "https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-classic--06-14-16.png",
    "https://d3pgswpng8id0l.cloudfront.net/sitestatic/images/invoice-preview-nextmodern--06-14-16.png"
]
class InvoiceStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            invoiceSettingsInput: invoiceSettingPayload(),
            loading: false,
            imgLoading: false
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    componentDidMount(){
        this.fetchSettingData()
    }

    fetchSettingData = async () => {
        setTimeout(this.setState({ loading: true }), 300);
        try {
            const request = await fetchSalesSetting()
            if (request.data && request.data.salesSetting) {
                this.setState({ invoiceSettingsInput: request.data.salesSetting, loading: false })
            }
        } catch (error) {
            console.error("Error in fetching sales settings => ", error)
        }
    }
    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
            this.setState({ activeIndex: newIndex });
    }

    handleChangeColor(color, e){
        if(!!color){
            this.setState({
                invoiceSettingsInput: {
                    ...this.state.invoiceSettingsInput,
                    accentColour: color.hex
                }
            })
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let invoiceSettingsInput = this.state.invoiceSettingsInput;
        let { selectedBusiness } = JSON.parse(localStorage.getItem('reduxPersist:businessReducer'))
        // if (this.state.removeCompanyLogo) {
        //     invoiceSettingsInput.companyLogo = ""
        //     invoiceSettingsInput.displayLogo = false
        // }
        delete invoiceSettingsInput._id
        delete invoiceSettingsInput.createdAt
        delete invoiceSettingsInput.updatedAt
        delete invoiceSettingsInput.__v
        let salesSettingInput = {
            ...invoiceSettingsInput
        }
        try {
            let request = await addSalesSetting({ salesSettingInput });
            // this.props.updateData()
            this.props.setUserSettings(request.data.salesSetting);
            selectedBusiness.meta.invoice.firstVisit = false;
            const updateBusiness = await updateCompany(selectedBusiness._id, {businessInput: {meta: selectedBusiness.meta}})
            if(updateBusiness.statusCode === 200){
                this.props.setSelectedBussiness(selectedBusiness);
                history.push('/app/invoices?pre=true');
            }

            // this.props.openGlobalSnackbar("Settings updated sucessfully");
        } catch (error) {
            console.error("Error in invoice setting => ", error);
            // this.props.openGlobalSnackbar("Caught some error, please try again", true);
        }
    }

    onImageUpload = async (event) => {
        this.setState({
            imgLoading: true
        })
        let updateSettings = this.state.invoiceSettingsInput
        const file = event.target.files[0]
        let imageUrl
        if (file) {
            imageUrl = await this.getSignedUrl(file)
        }
        updateSettings["companyLogo"] = file ? imageUrl : undefined
        updateSettings["displayLogo"] = file ? true : false
        this.setState({ invoiceSettingsInput: updateSettings, imgLoading: false })
    }

    getSignedUrl = async (file) => {
        try {
            const payload = {
                s3Input: {
                    contentType: file.type,
                    fileName: file.name,
                    uploadType: 'logo'
                }
            }
            const response = await fetchSignedUrl(payload)
            const { sUrl, pUrl } = response.data.signedUrl
            if (sUrl) {
                await uploadImage(sUrl, file, file.type)
                return pUrl
            }
        } catch (error) {
            console.error("In Image Upload Error => ", error)
        }
    }
    render() {
        const { activeIndex, invoiceSettingsInput, imgLoading } = this.state;
        const { accentColour, companyLogo } = invoiceSettingsInput;
        console.log('invoiceSettingsInput', invoiceSettingsInput)
        const slides = items.map((item, i) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item}
                >
                    <img src={item} alt={item.template} />
                    {/* <CarouselCaption captionText={item.caption} captionHeader={item.caption} /> */}
                </CarouselItem>
            )
        })
        return (
            <div className="content-wrapper__main__fixed invoice-onBoarding__wrapper">
                <div className="py-header py-header--page justify-content-center text-center">
                    <div className="py-header--title">
                        <div className="py-heading--title">Create the perfect invoice to match your brand.</div>
                    </div>
                </div>
                <div className="py-box py-box--xlarge invoice__onboarding__container">
                    <div className="py-box--content">
                        <div className="invoice__onboarding__content__body">
                        <div className="invoice__onboarding__content__left">
                            <div className="invoice__onboarding__logo__upload__handle">
                                <div className="py-heading--subtitle">Add your logo</div>
                                    {
                                        !!companyLogo ?
                                        (
                                            <label for="InvoiceLogoUpload" className="py-uploader choose-logo">
                                                <img src={companyLogo}/>
                                                <a href="javascript: void(0)" onClick={() => this.setState({
                                                    invoiceSettingsInput: {
                                                        ...this.state.invoiceSettingsInput,
                                                        companyLogo: ""
                                                    }
                                                })}>Remove logo</a>
                                            </label>
                                        ) : (

                                            <label for="InvoiceLogoUpload" className="py-uploader choose-logo">
                                                <span className="py-upload__cloud-logo">
                                                    <svg  className="img-fluid" viewBox="0 0 54 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <g transform="translate(1.000000, 1.000000)">
                                                                <path d="M43.63,19.493 C43.63,10 39,0 28,0 C17,0 11.63,9 11.63,15.466 C5.63,15.466 0.114,18.401 0.001,27 C-0.112,35.599 6.932,38.52 10.712,38.52 L43.63,38.52 C47.31,38.52 52,36 52,29 C52,22 46.987,19.5 43.63,19.493 Z" id="Path" stroke="#B2C2CD"></path>
                                                                <path d="M27,12 L20.917,18.083 M27,12 L33,18 M27,12 L27,30" id="Shape" stroke="#9F55FF" fill="#D8D8D8" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </span>
                                                <span className="py-form__element__label">
                                                    <span className="py-text--strong">Browse your logo here. </span>
                                                    <span className="py-text--hint"> Maximum 10MB in size. <br />JPG, PNG, or GIF formats.</span>
                                                    <span className="py-text--hint"> Recommended size: 300 x 200 pixels.</span>
                                                    <input type="file" id="InvoiceLogoUpload" className="py-form__element" name='companyLogo' accept=".jpg,.png,.jpeg" onChange={this.onImageUpload}/>
                                                </span>
                                          </label>
                                        )
                                    }
                                </div>
                                <div className="invoice__onboarding__content__color__handle">
                                        <div className="py-heading--subtitle">Pick your accent color</div>
                                        <div className="py-box">
                                            <span className="py-text--hint">Tip: Drag both circles to change color.</span>
                                            <div classname="py-form-field__element py-color-picker__element">
                                                <div className="d-flex align-items-center py-color-picker__element-saturation-container">
                                                    <ChromePicker
                                                        color={`${accentColour}`}
                                                        onChange={this.handleChangeColor.bind(this)}
                                                    />
                                                    {/* <Input type="color"
                                                        name="accentColour"
                                                        className="py-form__element__color saturation-picker"
                                                        id="examplePassword" placeholder="password placeholder" /> */}
                                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="invoice__onboarding__content__right">
                            <div className="py-heading--subtitle">
                                Choose your template
                            </div>
                            <div className="invoice-onboarding-template-carousel">
                            <Carousel
                                activeIndex={activeIndex}
                                next={this.next}
                                previous={this.previous}
                            >
                                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                                {slides}
                                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                            </Carousel>
                            </div>
                        </div>

                        </div>

                        {/* end:: invoice onboard body */}

                        <div className="invoice__onboarding__content__footer">
                                <button className="btn btn-primary mb-3" onClick={this.handleSubmit.bind(this)}>Look great, let's go</button>

                                <span className="py-text--hint">You can <span className="py-text--strong">skip this</span> and make changes later by going to Settings.</span>
                        </div>
                        </div>

                    </div>


                </div>
        )
    }
}

const mapPropsToState = (state) => {
    return null
}

export default connect(mapPropsToState, {setUserSettings, setSelectedBussiness})(InvoiceStart)