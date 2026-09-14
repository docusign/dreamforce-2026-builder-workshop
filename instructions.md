# Builder Lab: Build a Docusign + Salesforce Agreement Workflow

## Resources
* [GitHub Link](https://github.com/docusign/dreamforce-2026-builder-workshop)
* [Docusign Developer Center](https://developers.docusign.com)
* [Docusign App Center](https://apps-d.docusign.com/app-center/)
* [Workflow Builder Documentation](https://developers.docusign.com/docs/workflow-builder-api/workflow-builder101/workflows/)
* [Extension App Documentation](https://developers.docusign.com/extension-apps/)
* [Use Cases](https://developers.docusign.com/use-cases/)

## Overview
1. Set up developer accounts and tools
1. Install and connect the Salesforce extension app
1. Build and configure a Docusign workflow
1. Test the workflow
1. Embed the workflow in a front-end app

## Part 1: Set up developer accounts and tools

### Step 1: Sign up for a free Docusign Developer Account
1. Open the Docusign Developer Center at https://developers.docusign.com
2. On the Developer Center, click Developer Account, then click Create account. </br><img src="images/CCA-img1.1.1.png" width="1000"/></br>
3. Enter First Name, Last Name, Email, Company, Company, and partnership status if
applicable. Use an email address not currently connected to an existing Docusign or
Salesforce account. Click **Get Started**. </br><img src="images/CCA-img1.1.2.png" width="500"/></br>
4. Locate and open the Docusign email notification sent to the email address you have
provided. Copy the confirmation code, paste it into the form in your browser, then click **Next**.</br><img src="images/CCA-img1.1.3.png" width="600"/></br><img src="images/CCA-img1.1.4.png" width="500"/></br>
5. If you are not redirected automatically, go to https://account-d.docusign.com and log into
your account. </br> <img src="images/CCA-img1.1.5.png" width="500"/></br>
6. Enter a password that meets the password rules shown, record it where you keep your
passwords, then click **Next**. Your account setup is complete and your developer account
opens. </br><img src="images/CCA-img1.1.6.png" width="500"/></br>

### Step 2. Sign up for a free Salesforce Developer Account
1. Go to the Salesforce Developer Center to sign up for a Salesforce developer account:
https://www.salesforce.com/products/free-trial/developer/
2. Fill in the required fields. Use the same email address tied to the Docusign developer
account you just created. Click **Sign me up**. ![]()</br><img src="images/CCA-img1.2.1.png" width="900"/></br>
3. Locate and open the Salesforce email notification sent to the email address you have
provided. (This email may take several minutes to appear in your inbox.) Click **Verify
Account**, enter a password and security question, and select **Change Password**. </br><img src="images/CCA-img1.2.2.png" width="500"/></br>
4. Bookmark the login link from the email to make future access of your Salesforce developer
account easier.

## Part 2. Install and connect the Salesforce extension app
1. Go to the Docusign developer App Center: https://apps-d.docusign.com/app-center and log in your Docusign developer account. </br><img src="images/CCA-img1.3.1.png" width="800"/></br>
3. Select the Salesforce extension app tile from the home screen, or search for term "Salesforce" and select the first result. </br><img src="images/CCA-img1.3.2.png" width="800"/></br>
4. Click **Install App**. </br><img src="images/CCA-img1.3.3.png" width="800"/></br>
5. Click **Install and Authorize**. </br><img src="images/CCA-img1.3.4.png" width="500"/></br>
6. Click **Connect Account**. </br><img src="images/CCA-img1.3.5.png" width="500"/></br>
7. Select **Salesforce Production**. You should see the url that you normally use to login to your Salesforce account displayed beside the appropriate option.</br><img src="images/CCA-img1.3.06.png" width="500"/></br>
8. Select **Private**.</br><img src="images/CCA-img1.3.07.png" width="500"/></br>
9. Name your connection. This named connection will be reference in the workflow builder when adding a step that uses the Salesforce extension app. </br><img src="images/CCA-img1.3.08.png" width="500"/></br>
10. Login with your Salesforce developer account and verify your identity. Be sure to use the username that Salesforce created when you signed up, and not your email address. </br><img src="images/CCA-img1.3.09.png" width="500"/></br><img src="images/CCA-img1.3.10.png" width="500"/></br>
11. Return the the App Center where you should see that you are successfully logged in with the Salesforce extension app.</br><img src="images/CCA-img1.3.11.png" width="500"/></br>

### Step 4. Download and configure the Docusign Builder Lab GitHub project
Prerequisite: Install Tools
* [VSCode](https://code.visualstudio.com/docs/setup/setup-overview)
* [Git](https://git-scm.com/install/)
* [Node.js](https://nodejs.org/en/download)


1. Fork, clone, or download a zip of the GitHub repo. To clone:
    ```
    git clone https://github.com/docusign/dreamforce-2026-builder-workshop
    ```
2. Follow the instructions in the project's [README](../README.md) to create and configure an IK in your Developer account and install dependencies.

## Part 3: Build and configure a Docusign workflow

### Verify contact records in your Salesforce system of record
1. Log in to your Salesforce developer account: https://login.salesforce.com/
2. Go to All Contacts (.../lightning/o/Contact/list?filterName=AllContacts) </br><img src="images/CCA-img2.1.1.png" width="900"/></br>
3. Ensure that you can see Contact records, this data should be provisioned for you. If none exist create a contact with address information.

### Create a Docusign workflow from a workflow template
1. Login to your Docusign developer account, click **Agreements**, and select **Workflows** to open [Workflow Builder](https://apps-d.docusign.com/send/workflows/).
2. Click **Create Workflow**.</br><img src="images/CCA-img2.2.1.png" width="900"/></br>
3. Search for the title "Address Change with Salesforce" and select the matching workflow template. </br><img src="images/CCA-img2.2.2.png" width="900"/></br>
4. Click **Use Template**.</br><img src="images/CCA-img2.2.4.png" width="900"/></br>

### Configure the workflow template steps
1. Review the full workflow flow to understand the default sequence and branching logic.</br><img src="images/CCA-img2.3.1.png" width="900"/></br>
2. Open **Customer Intake** make sure the "Customer Intake Form" webform is select and the participant is set to **Customer**.</br><img src="images/CCA-img2.3.2.png" width="500"/></br>
3. Open **Return Contact Info** and select the connection that you created in session 1 step 3. Select "Contact" as the type of record to read from. Verify the Salesforce fields being read are selected as shown:</br><img src="images/CCA-img2.3.3.png" width="500"/></br>
4. Open **Mailing Address Update Form** and confirm the web form used titled "Address Update Form" and the participant is **Customer**.</br><img src="images/CCA-img2.3.4.png" width="500"/></br>
5. In **Mailing Address Update Form**, go to **Map data fields**.</br><img src="images/CCA-img2.3.5.png" width="500"/></br>
6. Click **Map for Me** to auto-map the form fields to workflow variables.</br><img src="images/CCA-img2.3.6.png" width="700"/></br>
7. Open **Consent for Change - Prepare Template** and confirm fields are correctly mapped.</br><img src="images/CCA-img2.3.8.png" width="900"/></br>
9. Open **Consent for Change** and confirm direct signing is configured.</br><img src="images/CCA-img2.3.9.png" width="500"/></br>
10. Open **Completed Confirmation** and verify the message title and body. This step marks the end of customer interaction.</br><img src="images/CCA-img2.3.10.png" width="500"/></br>
11. Open **Update Mailing Address** and verify Salesforce write-back field mappings for the Contact record. These values should come from the **Consent For Change** step.</br><img src="images/CCA-img2.3.12.png" width="500"/></br>
12. Select the condition for writeback to the record where the `emailaddress` field of the record matches the `emailAddress` field from the **Consent For Change** step. </br><img src="images/CCA-img2.3.13.png" width="500"/></br>
13. Finally, open the **Store File in Salesforce** step and select the Record Id for the location. </br><img src="images/CCA-img2.3.14.png" width="500"/></br>

## Part 4: Test the workflow
1. In Salesforce, open a seeded contact record with mailing address details.</br><img src="images/CCA-img2.4.1.png" width="900"/></br>
2. Launch the workflow and click **Start**.</br><img src="images/CCA-img2.4.2.png" width="500"/></br>
3. Complete the **Account Information** screen and click **Next**.</br><img src="images/CCA-img2.4.3.png" width="500"/></br>
4. Review the current mailing address and continue.</br><img src="images/CCA-img2.4.4.png" width="500"/></br>
5. Enter a new mailing address and click **Next**.</br><img src="images/CCA-img2.4.5.png" width="500"/></br>
6. Continue through the consent prompt to begin eSignature.</br><img src="images/CCA-img2.4.6.png" width="500"/></br>
7. Review the agreement, sign, and finish the signing flow.</br><img src="images/CCA-img2.4.7.png" width="900"/></br>
8. Confirm the completion message displays after submission.</br><img src="images/CCA-img2.4.8.png" width="900"/></br>
9. Confirm that the address update is reflected in Salesforce. </br><img src="images/CCA-img2.4.9.png" width="900"/></br>

## Part 5: Embed the workflow in a front-end app

Files used in this session:
- [server/services/workflowService.js](server/services/workflowService.js)

### Step 1. Prepare your workflow in Docusign
1. Open the [Workflow Designer](https://apps-d.docusign.com/send/workflows/) and edit the workflow you created in Part 3. </br><img src="images/CCA-img3.1.1.png" width="900"/></br>
2. Set the trigger method to **From an API Call**. </br><img src="images/CCA-img3.1.2.png" width="900"/></br></br><img src="images/CCA-img3.1.3.png" width="900"/></br>
3. Publish the workflow. 

### Optional: Run API flow with Postman **or** the Docusign API reference tool

#### Postman
1. Open Postman in your browser or desktop app, or install using the [instructions](https://learning.postman.com/docs/getting-started/installation/installation-and-updates) provided by Postman for Windows, Mac, or Linux.
2. Select `File` --> `import` to upload the Workflows [collection](<Workflows - Trigger & Embed.postman_collection.json>) and [environment](Workflows.postman_environment.json). See [Postman instructions](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data)
3. Open the Workflows environment and copy over your oAuth credentials from [config.json](config.json) to the appropriate Postman environment variable. </br><img src="images/CCA-img3.0.1.png" width="900"/></br>
4. Select the Workflows Collection folder and go to the **Authorization** tab. Ensure that all of the environment variables are accurate and select **Get new access token**. Sign in with your Docusign developer account and click to consent to the scopes presented. </br><img src="images/CCA-img3.0.6.png" width="700"/></br>
5. Run the **Get workflows list** endpoint to obtain the workflow ID. </br><img src="images/CCA-img3.0.2.png" width="600"/></br>
6. Run the **Get workflow trigger requirements** endpoint with the workflow ID obtained in the previous step to get a list of trigger inputs. </br><img src="images/CCA-img3.0.3.png" width="900"/></br>
7. Run the **Trigger workflow** endpoint with a request body that includes values for the trigger input fields obtained in the previous step. </br><img src="images/CCA-img3.0.4.png" width="900"/></br>The response body includes the url for the workflow instance that you can open to complete the workflow or embed within an iframe in an application.

#### Docusign API reference
1. Open the [Workflow Builder API reference](https://developers.docusign.com/docs/workflow-builder-api/reference/) in the Docusign developer center.
2. Expand the Workflows tab to see a list of all endpoints that can be used to interact with Docusign Workflows.
3. Sign in with your Docusign developer account.
4. Open the desired API endpoint and select **try it** to run the workflow with your account details. </br><img src="images/CCA-img3.0.5.png" width="900"/></br>

### Step 2. Start the project locally
1. From the project root, install dependencies if needed:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open http://localhost:5173.

### Step 3. Verify end-to-end behavior
1. Open a workflow.
2. Fill required trigger fields.
3. Click **Run Workflow**.
4. Confirm the workflow starts and embed renders.

### Troubleshooting
1. `403` from Workflow Builder endpoints: verify your developer account has Workflow Builder enabled.
2. No workflows returned: ensure your workflow is published and active.
3. WORKSHOP TODO message: complete the matching TODO in workflow service. 

### Step 4. Download an audit trail

#### Using the UI
1. Go to the [Workflows tab]((https://apps-d.docusign.com/send/workflows/)) in your developer account.
2. Click the three-dot menu beside your desired workflow and select **View Activity Log**. </br><img src="images/CCA-img3.5.1.png" width="900"/></br>
3. You'll be able to view every action taken on that workflow. Select **Download CSV** to download the activity log. </br><img src="images/CCA-img3.5.2.png" width="900"/></br>

#### Using the API
1. In Postman, or using the [API reference tool](https://developers.docusign.com/docs/workflow-builder-api/reference/workflowbuilder/workflowinstancemanagement/getworkflowinstanceslist/), go to the **Get workflow instances list** endpoint to get a list of all instances for a given workflow in your account. 