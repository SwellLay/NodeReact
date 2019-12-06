import React from 'react';

export const Security = () => {
    return (
    <div className="content-wrapper__main__fixed">
        <div className="py-heading--title">Peymynt - Data Security</div>

        <div className="py-heading--section-title">Data Security</div>

        <p>PCI-DSS Compliant: Peymynt is Level 1 PCI-DSS compliant. This means that every year we have a third-party audit to
validate our practices and make sure we’re doing the right things for you and your customers.</p>

<p>Secure data transmission: When you load a page in your browser, or upload something to Peymynt, all that information is
encrypted while it’s moving over the internet. We lock up your data with up to 256-bit TLS encryption, the strength of
protection you get with online banking and shopping. We also support a wide variety of cyphers — another kind of code —
for our communications, to ensure the highest level of encryption possible, based on your browser.</p>

<p>Tokenization: Peymynt doesn’t store credit card numbers, ever. Credit card information is sent directly from the app or
browser to our payments processor, and Peymynt receives a secure token back. This token is a code that authorizes
Peymynt to complete the activity securely and efficiently, without storing or exposing your credit card information.</p>

<p>Secure data storage: Your accounting data is stored on servers that have strict physical access protocols, meaning there
are rules in place limiting access to only the people who need it to do their jobs. The facilities are controlled with
24/7 monitoring, and the technology is digitally protected.</p>

<p>Security Testing: Peymynt uses many layers of security testing. We test our systems internally, but that’s not enough in
our opinion. We also regularly bring in third-party security firms to perform vulnerability assessments and penetration
tests against our systems. Sounds great? Still not enough for us. Peymynt has a private bug bounty program through
HackerOne. This means that we’ve got security researchers from all over the globe testing our app on an ongoing basis.
It takes a lot of effort to keep things secure, and we’re happy to go the distance.</p>

<p>Transparency: We’re not asking you to just take our word for it that we keep your data secure. We want you to understand
exactly how it’s done. That’s why we’ve written, a very clear and understandable privacy policy. If you’re invoicing
your customers and they’re paying through Peymynt, we want them to be comfortable too, so we’ve written a special
customer privacy policy.</p>

<div className="py-heading--section-title">Mobile Security</div>

<p>Passwords are encrypted when they’re collected, when they’re sent to our servers, and we never store them without
encrypting them first. In fact, all communications between our apps and our servers are encrypted using Transport Layer
Security (TLS) — the replacement for Secure Sockets Layer (SSL) — the highest level of security protocols available.
Beyond that, we don't store any sensitive information, such as credit card numbers, on the device ever.</p>

<div  className="py-heading--section-title">Fraud Prevention</div>

<p>We’ve built an internal risk system that uses a wide variety of tools and insights to protect you and your customers
from fraud. We’ve integrated several third-party security and anti-fraud service providers to create a layered approach
to risk detection, for the highest level of protection. And our team of risk analysts monitor high risk and
out-of-pattern behavior to keep our platform safe.</p>

<p>We’ve got your back when it comes to chargebacks. Our team is trained to coach you in best business practices to make
sure you’re collecting the right information up front to protect your business from chargebacks. In the event that you
do receive a chargeback, our experts have the experience necessary to build your best case.</p>

<div className="py-heading--section-title">Bank Access Security</div>

<p>Read-only security: The connection Peymynt makes with your financial institutions to import transactions is read-only.</p>

<p>Password protection: For increased security, Peymynt employs industry-leading online banking services to manage bank
account and password data. These third parties are trusted by some of the world’s biggest banks, including Bank of
America, Citibank, and Wells Fargo.</p>

<p>Do you have additional questions about the security of Peymynt? Please contact us. We’d be happy to tell you more about
the many steps we take to ensure the security of your sensitive information.</p>
    </div>
)}