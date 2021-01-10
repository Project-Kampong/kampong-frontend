import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '@app/components/dialog/dialog.component';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openTermsAndConditions(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: 'Terms and Conditions',
        content: `<b>1. PDPA Introduction and Policy</b> <br />
        1.1. In line with its aim to comply with the requirements of the Personal Data Protection  Act (“PDPA”) and to maintain the highest standards of confidentiality with  respect to the personal data of all participants,  this document sets out the Personal Data Policy of the Project Kampong Team (“KAMPONG!”). <br />
        1.2. This Personal Data Policy applies to all information collected by Project Kampong from our participants and users. <br />
        1.3. For the purpose of this policy, the terms “we”, “us” or “our” shall, unless otherwise indicated, refer to Project Kampong or KAMPONG!. <br />
        <p></p>
        <b>2. Personal Data</b> <br />
        2.1. Personal data is personal information, whether true or not and whether in electronic or other form, about an individual who can be identified: <br />
        2.1.1 From that data; or <br />
        2.1.2 From that data and other information to which we have access to or are likely to have access to. <br />
        2.2. Examples of personal data are names, addresses, photographs or video images, telephone numbers, and email addresses. <br />
        2.3. We will do our best to ensure that your personal data is accurate. However, we do encourage you to provide us with an update of any particulars of your personal data that have changed as soon as possible. <br />
        <p></p>
        <b>3. Instances of Personal Data Collection</b>  <br />
        3.1. When you register on our KAMPONG! Application, on our website or at any event promoted or held by Project Kampong itself. <br />
        3.2. When your image is captured by Project Kampong’s videographers or photographers <br />
        3.3. When you provide post-event feedback on the google form we provide. <br />
        3.4. When you register interest on our website to kickstart a project listing or user sign ups. <br />
        <p></p>
        <b>4. Purpose and utilisation of Personal Data Information</b> <br />
        4.1. To maintain a record of Project Kampong Users and Project Listings which will be shown as a profile/portfolio in the web platform. <br />
        4.2. To facilitate community engagement under Project Kampong’s platform. <br />
        4.3. To create platforms for further interaction between users of Project Kampong.  <br />
        4.4. To notify registered users of event details. <br />
        4.5. To use photos and videos for publicity purposes on posters, websites, or social media. <br />
        4.6. To improve our processes, and further development. <br />
        4.7. To send you information and updates regarding Project Kampong’s activities and developments in your area. <br />
        4.8. To communicate and respond to Users’ requests and queries. <br />
        4.9. To comply with the law, the requests of law enforcement and regulatory officials, or orders of Court. <br />
        4.10. Towards any other purpose of use for which we have obtained your consent, express or implied. <br />
        <p></p>
        <b>5. Is My Consent Required and Can it be Withdrawn?</b>  <br />
        5.1. We will endeavour to obtain your consent to collect and use your personal data prior to or at the time we collect it. However, in certain situations you will be deemed to have consented to the provision of your personal data, e.g. where you provide your personal data voluntarily. <br />
        5.2. Regarding capturing images via photos and videos there will be written notice in the premises to duly inform participants. <br />
        5.3. You may at any time give us reasonable written notice of the withdrawal of your consent to collect, use or disclose your personal data. Once we receive the notice of withdrawal of your consent, we will inform you of the outcomes of your withdrawing consent. <br />
        <p></p>
        <b>6. Can I get access to or correct my personal data?</b> <br />
        6.1. You can view your personal data which we have collected and stored at any time. In order to do so, you will need to submit a request to our Administrator for access to view your personal data. We will respond to your request as soon as possible and within 30 days of receipt of your request, at the latest. <br />
        6.2. Your right to view your personal data is limited to your personal data only. We are not permitted to reveal any personal data about any other individual. We reserve the right to refuse access to your personal data if it will reveal or lead to the revelation of another individual’s personal data, cause harm to you or another individual or is contrary to the national interest. <br />
        6.3. You can submit a written request to correct your personal data which we have collected and stored. We will consider your request and respond to it as soon as possible and within 30 days of receipt of your request, at the latest. We will make the necessary corrections as soon as reasonably practicable provided we are satisfied that the corrections should be made. In the event that we feel the corrections should not be made, we will inform you. <br />
        <p></p>
        <b>7. Is my personal data secured?</b> <br />
        7.1. Project Kampong’s Team makes every effort to maintain decent standards of confidentiality and security of your personal data. To this end, we have internal guidelines and procedures in place to ensure that your personal data is kept secure. This includes the following: <br />
        7.1.1 Restricted access to your personal data and access only when it is required; <br />
        7.1.2 Team members who are briefed and kept informed of our data policies and practices <br />
        7.1.3 Centralized storage of data on google cloud platforms to leverage on Google’s cybersecurity <br />
        <p></p>
        <b>8. How long will Project Kampong retain my personal data?</b> <br />
        8.1. Project Kampong will retain your personal data for as long as the purpose for which your personal data was collected is still being served unless informed otherwise by you. <br />
        <p></p>
        <b>9. Who can I contact about my personal data or this policy?</b> <br />
        9.1. If you have any queries or doubts about the policies set out in this statement or about your personal data that we obtain, maintain, process, use and disclose, or if you would like to access or correct your personal data, please contact us at any of the following: <br />
        <a href = "mailto: joinourkampong@gmail.com" target="_blank">joinourkampong@gmail.com  </a> <br />
        <a href="https://www.facebook.com/ProjectKampong.SG/" target="_blank">https://www.facebook.com/ProjectKampong.SG/</a>  <br />
        <a href="https://www.instagram.com/projectkampong/" target="_blank">https://www.instagram.com/projectkampong/</a>  <br />
        9.2. For more information about the PDPA, please visit the Personal Data Protection Commission’s website at <a href="http://www.pdpc.gov.sg" target="_blank">http://www.pdpc.gov.sg</a>
        `,
      },
    });
  }
}
