function getMailer(baseUrl, publicToken) {
    return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta content="telephone=no" name="format-detection" />
    <title>Reset password link</title>
    <style type="text/css">
        html,
        body {
            height: 100%;
        }

        body {
            -webkit-text-size-adjust: 100% !important;
            -ms-text-size-adjust: 100% !important;
            -webkit-font-smoothing: antialiased !important;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5
        }

        td {
            word-wrap: break-word;
            font-size: 0px;
            vertical-align: top;
            direction: ltr;
            padding: 0px 20px 0px 20px
        }

        p {
            line-height: 1.5;
            font-size: 16px;
            font-family: Arial, sans-serif;
            color: #03393c;
            padding: 0;
            margin-bottom: 20px;
            text-align: left
        }

        a {
            color: #136acd
        }
    </style>
    <!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
 </o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>

<body style="margin:0px; padding:0px;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"
        style="margin:0px; padding:0px; background-color: #f0f3f7; height: auto !important; min-height: 100%;">
        <!-- Header logo -->
        <tr style="height: 0px;">
            <td style="text-align: center;padding: 20px 0px">
                <img style="max-width: 250px;" src="https://cdn.peymynt.com/static/mailer/logo-banner-small.png"
                    alt="Peymynt logo" />
            </td>
        </tr>
        <!-- Mail body -->
        <tr>
            <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"
                    style="margin:10px auto;max-width:620px;background:#fff">
                    <tr>
                        <td>
                            <h1
                                style="font-size:32px;font-family:Arial,sans-serif;color:#03393c;padding:0;margin:20px 0px 0px 0px;line-height:110%;text-align:left">
                                Reset your password</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>You're receiving this email because you requested a password reset for Peymynt.</p>
                            <p>To reset your password, follow these 2 steps:</p>
                            <p>
                                <a href="${baseUrl}/password/reset/confirm/${publicToken}"
                                    target="_blank">${baseUrl}/password/reset/confirm/${publicToken}</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td
                            style="text-align:left;vertical-align:top;direction:ltr;font-size:0px;padding:0px;padding-bottom:10px;padding-left:10px;padding-right:10px">

                            <div
                                style="color:#03393c;font-family:Arial;font-size:16px;line-height:22px;text-align:left">
                                <ol>

                                    <li>Create a new password by clicking the link above</li>
                                    <li>Sign in to Peymynt with your primary email address and enter the new password
                                    </li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p
                                style="font-size:16px;font-family:Arial,sans-serif;color:#03393c;padding:0;margin:0;margin-bottom:20px;text-align:left">
                                If the link doesn't work, try copying and pasting it into your browser. If you continue
                                to experience issues with signing in, or if you didn’t request this password reset,
                                please
                                <a href="#" target="_blank">contact us</a>.</p>
                            <p>Thanks!<br>The Peymynt Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top" style="padding-left:14px; padding-right:14px;">
                            <table width="500" border="0" cellspacing="0" cellpadding="0" align="center"
                                style="width:500px;" class="wrapper">
                                <!-- <tr>
                                    <td align="center" valign="top" style="padding-top:10px;"><img
                                            src="images/powered_by.png" width="153" height="20" alt="Powered by"
                                            style="display:block;" border="0"></td>
                                </tr> -->
                                <tr>
                                    <td align="center" valign="top"
                                        style="text-align: center; font-size: 12px; color: #4d6575; font-family:Arial, sans-serif; line-height:22px; padding-top:5px; padding-bottom:35px;">
                                        &copy; 2019 Peymynt Inc. All Rights Reserved.<br><a
                                            href="${baseUrl}/assets/pages/privacypolicy.html"
                                            target="_blank" style="text-decoration:none; color: #4d6575;">Privacy
                                            Policy</a> • <a href="${baseUrl}/assets/pages/termsofuse.html"
                                            target="_blank" style="color: #4d6575; text-decoration:none;">Terms of
                                            Use</a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`
}

function renderMailer(publicToken) {
    let mail = getMailer(process.env.BASE_URL, publicToken);
    return mail;
}
module.exports = {
    render: renderMailer
}