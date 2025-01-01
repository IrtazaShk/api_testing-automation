import { test, expect } from '@playwright/test';

test('make a POST request', async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/booking/', {
        data: {
            firstname: "Playwright",
            lastname: "ApiAutomation",
            totalprice: 1000,
            depositpaid: true,
            bookingdates: {
                checkin: "2025-01-01",
                checkout: "2025-01-02"
            },
            additionalneeds: "QA"
        }
    });

    const response_status_code = response.status();
    expect(response_status_code).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody).toHaveProperty('bookingid');
});

test('make a GET request', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/');
    const responseBody = await response.json();
    console.log("Response Body: ",responseBody);
    const response_status_code = await response.status();
    console.log("Response Status Code: ", response_status_code);
    await expect(response_status_code).toBe(200);
});


