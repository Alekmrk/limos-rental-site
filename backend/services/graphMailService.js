const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
require('isomorphic-fetch');
require('dotenv').config();

const USER_EMAIL = 'info@elitewaylimo.ch';

const credentials = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

const getAuthenticatedClient = async () => {
    const authProvider = new TokenCredentialAuthenticationProvider(credentials, {
        scopes: ['https://graph.microsoft.com/.default']  // This includes all configured API permissions
    });
    
    return Client.initWithMiddleware({
        authProvider: authProvider,
        defaultVersion: 'v1.0'
    });
};

const listEmails = async (limit = 10) => {
    try {
        const client = await getAuthenticatedClient();
        const messages = await client
            .api(`/users/${USER_EMAIL}/messages`)
            .select('subject,receivedDateTime,from,bodyPreview')
            .top(limit)
            .get();
        
        return messages;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};

const sendEmail = async (subject, content, recipients) => {
    try {
        const client = await getAuthenticatedClient();
        const message = {
            subject,
            importance: 'normal',
            body: {
                contentType: 'HTML',
                content
            },
            from: {
                emailAddress: {
                    address: USER_EMAIL,
                    name: 'Elite Way Limo'
                }
            },
            sender: {
                emailAddress: {
                    address: USER_EMAIL,
                    name: 'Elite Way Limo'
                }
            },
            toRecipients: recipients.map(email => ({
                emailAddress: { address: email }
            })),
            internetMessageHeaders: [
                {
                    name: 'x-ms-exchange-organization-authas',
                    value: 'Internal'
                },
                {
                    name: 'x-ms-exchange-organization-authsource',
                    value: 'elitewaylimo.ch'
                }
            ]
        };

        // Send as user
        await client.api(`/users/${USER_EMAIL}/sendMail`)
            .post({
                message,
                saveToSentItems: true
            });
            
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const listCalendarEvents = async (days = 7) => {
    try {
        const client = await getAuthenticatedClient();
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + days);

        const events = await client
            .api(`/users/${USER_EMAIL}/calendar/events`)
            .select('subject,start,end,organizer,location')
            .get();

        return events;
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
    }
};

const createCalendarEvent = async (subject, start, end, attendees) => {
    try {
        const client = await getAuthenticatedClient();
        const event = {
            subject,
            start: {
                dateTime: start,
                timeZone: 'Europe/Zurich'
            },
            end: {
                dateTime: end,
                timeZone: 'Europe/Zurich'
            },
            body: {
                contentType: "HTML",
                content: `<p>You have been invited to a meeting with Elite Way Limo.</p>
                         <p>Date: ${new Date(start).toLocaleDateString('en-CH', { timeZone: 'Europe/Zurich' })}</p>
                         <p>Time: ${new Date(start).toLocaleTimeString('en-CH', { timeZone: 'Europe/Zurich' })} - 
                               ${new Date(end).toLocaleTimeString('en-CH', { timeZone: 'Europe/Zurich' })}</p>`
            },
            location: {
                displayName: "Elite Way Limo Office"
            },
            isOnlineMeeting: true,
            allowNewTimeProposals: true,
            attendees: attendees.map(email => ({
                emailAddress: { address: email },
                type: 'required'
            }))
        };

        const result = await client
            .api(`/users/${USER_EMAIL}/calendar/events`)
            .post(event);

        return result;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
};

module.exports = {
    listEmails,
    sendEmail,
    listCalendarEvents,
    createCalendarEvent
};