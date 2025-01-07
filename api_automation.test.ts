import { test, expect } from '@playwright/test';

//-----------------------------------------POST----------------------------------------

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

//-----------------------------------------GET----------------------------------------

test('make a GET request', async ({ request }) => {
    const response = await request.get('https://restful-booker.herokuapp.com/booking/');
    const responseBody = await response.json();
    console.log("Response Body: ",responseBody);
    const response_status_code = await response.status();
    console.log("Response Status Code: ", response_status_code);
    await expect(response_status_code).toBe(200);
});

//-----------------------------------------PUT----------------------------------------
var token;

test("Make a PUT request", async ({ request }) => {
    const response = await request.post('https://restful-booker.herokuapp.com/auth', {
        data: {
        "username": "admin",
        "password": "password123"
        }
        });
        console.log(await response.json());
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        token = responseBody.token;
        console.log("New Token is: " + token);
        
        
        const putRequest = await request.put('https://restful-booker.herokuapp.com/booking/1', {
        
            headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Cookie': `token=${token}`
                    },
            data: {
                        "firstname": "PlaywrightAuto",
                        "lastname": "ApiTesting",
                        "totalprice": 111,
                        "depositpaid": true,
                        "bookingdates": 
                            {
                            "checkin": "2023-06-01",
                            "checkout": "2023-06-15"
                            },
                        "additionalneeds": "Breakfast"
                    }
        });
        console.log(putRequest.json());
        console.log("Request Status Code:", putRequest.status());
        console.log('Success');
        const putResponseBody = await putRequest.json()
        expect(putResponseBody).toHaveProperty("firstname", "PlaywrightAuto");
        expect(putResponseBody).toHaveProperty("lastname", "ApiTesting");
});
//-----------------------------------------DELETION----------------------------------------
var delToken;

test("Make a DELETE request", async ({ request }) => {
    const authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
        data: {
            "username": "admin",
            "password": "password123"
        }
    });

    expect(authResponse.ok()).toBeTruthy();
    expect(authResponse.status()).toBe(200);

    const authResponseBody = await authResponse.json();
    const delToken = authResponseBody.token;
    console.log("New Token is:", delToken);

    const response = await request.delete('https://restful-booker.herokuapp.com/booking/1', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${delToken}`
        }
    });

    console.log("Request Status Code:", response.status());
    if (response.status() === 201) {
        console.log('Booking deleted successfully');
    } else if (response.status() === 404) {
        console.log('Booking already deleted or not found');
    } else {
        console.log('Failed to delete booking');
    }

    try {
        const responseJson = await response.json();
        console.log("Response JSON:", responseJson);
    } catch (error) {
        console.log("No JSON body in the response or failed to parse JSON:", error);
    }

    expect([201, 404]).toContain(response.status());
});
