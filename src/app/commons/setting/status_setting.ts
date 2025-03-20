export class StatusSetting {

    public static targetJobMarket = [
        { id: 1, name: 'Spot Market Job', },
        { id: 2, name: 'Long Term Contractual', },
        { id: 3, name: 'Open for any Job', },
    ];
    public static userVerification = [
        { id: 0, name: 'Unclaimed', },
        { id: 1, name: 'Register', },
    ];

    public static availability = [
        { id: 1, name: 'Open to discuss any new Shipment/load', },
        { id: 2, name: 'I am NOT looking for new Shipment/load', },
    ];

    public static carrierOperation = [
        { id: 1, name: 'Interstate', },
        { id: 2, name: 'Intrastate Hazmat', },
        { id: 3, name: 'Intrastate Non-Hazmat', },
    ];
    public static carrierFeatures = [
        {
            personalizeProfile: [
                { head: 'Personalize Profile'},
                { name: 'Add your equipment types'},
                { name: 'Add your shipment types' },
                { name: 'Add preferred lanes and operating areas'},
                { name: 'Add terminals'},
                { name: 'Add additional contact information', subscriptionPlanType:'1'},
                { name: 'Add Availability'},
                { name: 'Add Fuel consumption'},
                { name: 'Add Target Job Market'}
            ],
            optimizeProfile: [
                { head: 'Optimize Profile'},
                { name: 'Add a logo'},
                { name: 'Add a description'},
                { name: 'Add description USING-AI'},
                { name: 'Add a banner image'},
                { name: 'Add images'},
                { name: 'Add Videos'},
                { name: 'Add documents'},
                { name: 'Add Insurence Certificate'},
                { name: 'We design your logo' },
                { name: 'We write your company description' },
                { name: 'We design your banner image' },
            ],
            reviews: [
                { head: 'Reviews' },
                { name: 'Dedicated page to collect reviews' },
                { name: 'Dedicated page to collect reviews USING-AI'},
                { name: 'Email templates to assist in review outreach USING-AI'},
                {name: 'Respond to your reviews'},
                {name: 'Respond to your reviews USING-AI '},
                {name: 'Feature your favorite review'},
                {name: 'We run your review companigns'},
                {name: 'Embed reviews and star rating on your website'},
                { name: 'Manage Review' },
                { name: 'Dedicated Way to Read Review detail' },
            ],
            advertisingMarketing: [
                {head: 'Advertising/Marketing', },
                {name: 'Advertise on all other carrier profiles'},
                {name: 'Advertise in search results'},
                {name: 'Remove other carrier advertisements from your profile'},
                {name: 'Get highlighted on CarriersNetwork social channels'},
                {name: 'Custom website USING-AI'},
            ],
            analytics: [
                { head: 'Analytics' },
                { name: 'Access detailed analytics on your profile traffic' },
                { name: 'See the brokerages viewing your profile and contact information' },
                {name: 'Receive a monthly analytics report '}
            ],
        }
    ];
    public static nonCarrierFeatures = [
        {
            carrierSearch: [
                { head: 'Carrier Search' },
                { name: 'Target Job Market' },
                { name: 'Availability' },
                { name: 'Operation Status' },
                { name: 'Fuel consumption Types' },
                { name: 'Cargo Type' },
                { name: 'Truck Types / Equipment Types' },
                { name: 'Hazardous Materials' },
                { name: 'Rate Per Miles' },
                { name: 'Number of Trucks' },
                { name: 'Number of Drivers' },
            ],
            organize: [
                { head: 'Organize' },
                { name: 'Create private lists of carriers' },
                { name: 'Keep personal notes on carriers' },
            ],
            feedback: [
                { head: 'Feedback' },
                { name: 'Review carriers you have worked with' },
            ],
            viewCarrierInfo: [
                { head: 'View Carrier Info' },
                { name: 'Read reviews' },
                { name: 'View contact info' },
                { name: 'View truck types' },
                { name: 'View shipment types' },
                { name: 'View safety & insurance information' },
            ],
        }
    ];


    public static shipmentType = [
        { id: 1, name: 'Less Than Truckload (LTL)', },
        { id: 2, name: 'Full Truckload (FTL)', },
        { id: 3, name: 'Partial Shipments', },
    ];

    public static equipmentType = [
        { 'id': "1", "name": 'Auto Carrier Trailer', 'class': "more" },
        { 'id': "2", "name": 'Box Truck', 'class': "more" },
        { 'id': "3", "name": 'Cargo Van', 'class': "more" },
        { 'id': "4", "name": 'Car Hauler', 'class': "more" },
        { 'id': "5", "name": 'Chassis Trailer', 'class': "more" },
        { 'id': "6", "name": 'Conestoga Trailer', 'class': "less" },
        { 'id': "7", "name": 'Container Trailer', 'class': "less" },
        { 'id': "8", "name": 'Conveyor Truck', 'class': "less" },
        { 'id': "9", "name": 'Double Drop Trailer', 'class': "less" },
        { 'id': "10", "name": 'Drayage Trailer', 'class': "less" },
        { 'id': "11", "name": 'Drop Deck Landoll', 'class': "less" },
        { 'id': "12", "name": 'Dry Van', 'class': "less" },
        { 'id': "13", "name": 'Dump Trailer', 'class': "less" },
        { 'id': "14", "name": 'Flatbed Trailer', 'class': "less" },
        { 'id': "15", "name": 'Hopper Bottom Trailer', 'class': "less" },
        { 'id': "16", "name": 'Hotshot Trailer', 'class': "less" },
        { 'id': "17", "name": 'Intermodal Trailer', 'class': "less" },
        { 'id': "18", "name": 'Logistics Van', 'class': "less" },
        { 'id': "19", "name": 'Lowboy Trailer', 'class': "less" },
        { 'id': "20", "name": 'Power Unit Only', 'class': "less" },
        { 'id': "21", "name": 'Refrigerated Trailer', 'class': "less" },
        { 'id': "22", "name": 'Refrigerated Box Truck', 'class': "less" },
        { 'id': "23", "name": 'Rgn Trailer Stretch', 'class': "less" },
        { 'id': "24", "name": 'Sprinter Van', 'class': "less" },
        { 'id': "25", "name": 'Step Deck', 'class': "less" },
        { 'id': "26", "name": 'Stepdeck Conestoga', 'class': "less" },
        { 'id': "27", "name": 'Stretch Rgn Trailer', 'class': "less" },
        { 'id': "28", "name": 'Tanker Trailer', 'class': "less" },
        { 'id': "29", "name": 'Van Conestoga', 'class': "less" },
        { 'id': "30", "name": 'RGN Trailer', 'class': "less" },
        { 'id': "31", "name": 'Oversized', 'class': "less" },
        { 'id': "32", "name": 'Pneumatic', 'class': "less" },
    ]
    public static fuelConsump = [
        { 'fuelId': "1", "fuelName": 'Gasoline', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "2", "fuelName": 'Diesel', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "3", "fuelName": 'Off-Road Diesel', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "4", "fuelName": 'Propane', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "5", "fuelName": 'Compressed Natural Gas', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "6", "fuelName": 'Ethanol', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "7", "fuelName": 'Bio-diesel', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
        { 'fuelId': "8", "fuelName": 'Kerosene', "Ischecked": false, 'ratePerMiles': "", 'class': "more" },
    ]

    public static countryList = [
        {
            "country": "USA",
            "urlSlug": "united-states",
            "countryCode": "1",
            "flag": "/assets/country/us.png",
            "code": "US"
        },
        {
            "country": "Canada",
            "urlSlug": "canada",
            "countryCode": "1",
            "flag": "/assets/country/ca.png",
            "code": "CA"
        },
        {
            "country": "Mexico",
            "urlSlug": "mexico",
            "countryCode": "52",
            "flag": "/assets/country/mx.png",
            "code": "MX"
        }
    ]
    public static usStateList = [
        {
            "name": "Alabama",
            "urlSlug": "alabama",
            "code": "AL",
            "count": "65"
        },
        {
            "name": "Alaska",
            "urlSlug": "alaska",
            "code": "AK",
            "count": "65"
        },
        {
            "name": "American Samoa",
            "urlSlug": "american-samoa",
            "code": "AS",
            "count": "65"
        },
        {
            "name": "Arizona",
            "urlSlug": "arizona",
            "code": "AZ",
            "count": "65"
        },
        {
            "name": "Arkansas",
            "urlSlug": "arkansas",
            "code": "AR",
            "count": "65"
        },
        {
            "name": "California",
            "urlSlug": "california",
            "code": "CA",
            "count": "65"
        },
        {
            "name": "Colorado",
            "urlSlug": "colorado",
            "code": "CO",
            "count": "65"
        },
        {
            "name": "Connecticut",
            "urlSlug": "connecticut",
            "code": "CT",
            "count": "65"
        },
        {
            "name": "Delaware",
            "urlSlug": "delaware",
            "code": "DE",
            "count": "65"
        },
        {
            "name": "District Of Columbia",
            "urlSlug": "district-of-columbia",
            "code": "DC",
            "count": "65"
        },
        {
            "name": "Federated States Of Micronesia",
            "urlSlug": "federated-states-of-micronesia",
            "code": "FM",
            "count": "65"
        },
        {
            "name": "Florida",
            "urlSlug": "florida",
            "code": "FL",
            "count": "65"
        },
        {
            "name": "Georgia",
            "urlSlug": "georgia",
            "code": "GA",
            "count": "65"
        },
        {
            "name": "Guam",
            "urlSlug": "guam",
            "code": "GU",
            "count": "65"
        },
        {
            "name": "Hawaii",
            "urlSlug": "hawaii",
            "code": "HI",
            "count": "65"
        },
        {
            "name": "Idaho",
            "urlSlug": "idaho",
            "code": "ID",
            "count": "65"
        },
        {
            "name": "Illinois",
            "urlSlug": "illinois",
            "code": "IL",
            "count": "65"
        },
        {
            "name": "Indiana",
            "urlSlug": "indiana",
            "code": "IN",
            "count": "63"
        },
        {
            "name": "Iowa",
            "urlSlug": "iowa",
            "code": "IA",
            "count": "69"
        },
        {
            "name": "Kansas",
            "urlSlug": "kansas",
            "code": "KS",
            "count": "78"
        },
        {
            "name": "Kentucky",
            "urlSlug": "kentucky",
            "code": "KY",
            "count": "89"
        },
        {
            "name": "Louisiana",
            "urlSlug": "louisiana",
            "code": "LA",
            "count": "77"
        },
        {
            "name": "Maine",
            "urlSlug": "maine",
            "code": "ME",
            "count": "76"
        },
        {
            "name": "Marshall Islands",
            "urlSlug": "marshall-islands",
            "code": "MH",
            "count": "75"
        },
        {
            "name": "Maryland",
            "urlSlug": "maryland",
            "code": "MD",
            "count": "75"
        },
        {
            "name": "Massachusetts",
            "urlSlug": "massachusetts",
            "code": "MA",
            "count": "75"
        },
        {
            "name": "Michigan",
            "urlSlug": "michigan",
            "code": "MI",
            "count": "75"
        },
        {
            "name": "Minnesota",
            "urlSlug": "minnesota",
            "code": "MN",
            "count": "45"
        },
        {
            "name": "Mississippi",
            "urlSlug": "mississippi",
            "code": "MS",
            "count": "73"
        },
        {
            "name": "Missouri",
            "urlSlug": "missouri",
            "code": "MO",
            "count": "23"
        },
        {
            "name": "Montana",
            "urlSlug": "montana",
            "code": "MT",
            "count": "73"
        },
        {
            "name": "Nebraska",
            "urlSlug": "nebraska",
            "code": "NE",
            "count": "73"
        },
        {
            "name": "Nevada",
            "urlSlug": "nevada",
            "code": "NV",
            "count": "73"
        },
        {
            "name": "New Hampshire",
            "urlSlug": "new-hampshire",
            "code": "NH",
            "count": "73"
        },
        {
            "name": "New Jersey",
            "urlSlug": "new-jersey",
            "code": "NJ",
            "count": "78"
        },
        {
            "name": "New Mexico",
            "urlSlug": "new-mexico",
            "code": "NM",
            "count": "79"
        },
        {
            "name": "New York",
            "urlSlug": "new-york",
            "code": "NY",
            "count": "19"
        },
        {
            "name": "North Carolina",
            "urlSlug": "north-carolina",
            "code": "NC",
            "count": "29"
        },
        {
            "name": "North Dakota",
            "urlSlug": "north-dakota",
            "code": "ND",
            "count": "73"
        },
        {
            "name": "Northern Mariana Islands",
            "urlSlug": "northern-mariana-islands",
            "code": "MP",
            "count": "33"
        },
        {
            "name": "Ohio",
            "urlSlug": "ohio",
            "code": "OH",
            "count": "34"
        },
        {
            "name": "Oklahoma",
            "urlSlug": "oklahoma",
            "code": "OK",
            "count": "33"
        },
        {
            "name": "Oregon",
            "urlSlug": "oregon",
            "code": "OR",
            "count": "36"
        },
        {
            "name": "Palau",
            "urlSlug": "palau",
            "code": "PW",
            "count": "38"
        },
        {
            "name": "Pennsylvania",
            "urlSlug": "pennsylvania",
            "code": "PA",
            "count": "38"
        },
        {
            "name": "Puerto Rico",
            "urlSlug": "puerto-rico",
            "code": "PR",
            "count": "38"
        },
        {
            "name": "Rhode Island",
            "urlSlug": "rhode-island",
            "code": "RI",
            "count": "38"
        },
        {
            "name": "South Carolina",
            "urlSlug": "south-carolina",
            "code": "SC",
            "count": "38"
        },
        {
            "name": "South Dakota",
            "urlSlug": "south-dakota",
            "code": "SD",
            "count": "38"
        },
        {
            "name": "Tennessee",
            "urlSlug": "tennessee",
            "code": "TN",
            "count": "38"
        },
        {
            "name": "Texas",
            "urlSlug": "texas",
            "code": "TX",
            "count": "38"
        },
        {
            "name": "Utah",
            "urlSlug": "utah",
            "code": "UT",
            "count": "38"
        },
        {
            "name": "Vermont",
            "urlSlug": "vermont",
            "code": "VT",
            "count": "85"
        },
        {
            "name": "Virgin Islands",
            "urlSlug": "virgin-islands",
            "code": "VI",
            "count": "86"
        },
        {
            "name": "Virginia",
            "urlSlug": "virginia",
            "code": "VA",
            "count": "87"
        },
        {
            "name": "Washington",
            "urlSlug": "washington",
            "code": "WA",
            "count": "45"
        },
        {
            "name": "West Virginia",
            "urlSlug": "west-virginia",
            "code": "WV",
            "count": "44"
        },
        {
            "name": "Wisconsin",
            "urlSlug": "wisconsin",
            "code": "WI",
            "count": "43"
        },
        {
            "name": "Wyoming",
            "urlSlug": "wyoming",
            "code": "WY",
            "count": "49"
        }
    ]
    public static caStateList = [
        {
            "name": "Alberta",
            "urlSlug": "alberta",
            "code": "AB",
            "count": "62"
        },
        {
            "name": "British Columbia",
            "urlSlug": "british-columbia",
            "code": "BC",
            "count": "72"
        },
        {
            "name": "Manitoba",
            "urlSlug": "manitoba",
            "code": "MB",
            "count": "10"
        },
        {
            "name": "New Brunswick",
            "urlSlug": "new-brunswick",
            "code": "NB",
            "count": "10"
        },
        {
            "name": "Newfoundland and Labrador",
            "urlSlug": "newfoundland-and-labrador",
            "code": "NL",
            "count": "10"
        },
        {
            "name": "Northwest Territories",
            "urlSlug": "northwest-territories",
            "code": "NT",
            "count": "10"
        },
        {
            "name": "Nova Scotia",
            "urlSlug": "nova-scotia",
            "code": "NS",
            "count": "10"
        },
        {
            "name": "Nunavut",
            "urlSlug": "nunavut",
            "code": "NU",
            "count": "10"
        },
        {
            "name": "Ontario",
            "urlSlug": "ontario",
            "code": "ON",
            "count": "10"
        },
        {
            "name": "Prince Edward Island",
            "urlSlug": "prince-edward-island",
            "code": "PE",
            "count": "10"
        },
        {
            "name": "Quebec",
            "urlSlug": "quebec",
            "code": "QC",
            "count": "10"
        },
        {
            "name": "Saskatchewan",
            "urlSlug": "saskatchewan",
            "code": "SK",
            "count": "71"
        },
        {
            "name": "Yukon",
            "urlSlug": "alaska",
            "code": "YT",
            "count": "70"
        }
    ]
    public static mxStateList: [
        {
            "name": "Aguascalientes",
            "urlSlug": "aguascalientes",
            "code": "Ags.",
            "count": "23"
        },
        {
            "name": "Baja California",
            "urlSlug": "baja-california",
            "code": "B.C.",
            "count": "24"
        },
        {
            "name": "Baja California Sur",
            "urlSlug": "baja-california-sur",
            "code": "BCS",
            "count": "55"
        },
        {
            "name": "Campeche",
            "urlSlug": "campeche",
            "code": "Camp.",
            "count": "55"
        },
        {
            "name": "Chiapas",
            "urlSlug": "chiapas",
            "code": "Chis.",
            "count": "54"
        },
        {
            "name": "Chihuahua",
            "urlSlug": "chihuahua",
            "code": "Chih.",
            "count": "56"
        },
        {
            "name": "Coahuila",
            "urlSlug": "coahuila",
            "code": "Coah.",
            "count": "57"
        },
        {
            "name": "Colima",
            "urlSlug": "colima",
            "code": "Col.",
            "count": "57"
        },
        {
            "name": "Durango",
            "urlSlug": "durango",
            "code": "Dgo.",
            "count": "57"
        },
        {
            "name": "Guanajuato",
            "urlSlug": "guanajuato",
            "code": "Gto.",
            "count": "57"
        },
        {
            "name": "Guerrero",
            "urlSlug": "guerrero",
            "code": "YT",
            "count": "57"
        },
        {
            "name": "BCS",
            "urlSlug": "bCS",
            "code": "YT",
            "count": "57"
        },
        {
            "name": "Jalisco",
            "urlSlug": "jalisco",
            "code": "Jal.",
            "count": "57"
        },
        {
            "name": "Mexico",
            "urlSlug": "mexico",
            "code": "CDMX",
            "count": "57"
        },
        {
            "name": "Michoacan",
            "urlSlug": "michoacan",
            "code": "Mich.",
            "count": "57"
        },
        {
            "name": "Morelos",
            "urlSlug": "alaska",
            "code": "Mor.",
            "count": "57"
        },
        {
            "name": "Nuevo Leon",
            "urlSlug": "nuevo-leon",
            "code": "N.L.",
            "count": "57"
        },
        {
            "name": "Nayarit",
            "urlSlug": "nayarit",
            "code": "Nay.",
            "count": "51"
        },
        {
            "name": "Oaxaca",
            "urlSlug": "oaxaca",
            "code": "Oax.",
            "count": "52"
        },
        {
            "name": "Puebla",
            "urlSlug": "puebla",
            "code": "Pue.",
            "count": "59"
        },
        {
            "name": "Queretaro",
            "urlSlug": "queretaro",
            "code": "Qro.",
            "count": "62"
        },
        {
            "name": "Quintana Roo",
            "urlSlug": "quintana-roo",
            "code": "Q.R.",
            "count": "61"
        },
        {
            "name": "San Luis Potosi",
            "urlSlug": "san-luis-potosi",
            "code": "S.L.P.",
            "count": "61"
        },
        {
            "name": "Sinaloa",
            "urlSlug": "sinaloa",
            "code": "Sin.",
            "count": "61"
        },
        {
            "name": "Sonora",
            "urlSlug": "sonora",
            "code": "Son.",
            "count": "61"
        },
        {
            "name": "Tabasco",
            "urlSlug": "tabasco",
            "code": "Tab.",
            "count": "61"
        },
        {
            "name": "Tamaulipas",
            "urlSlug": "tamaulipas",
            "code": "Tamps.",
            "count": "61"
        },
        {
            "name": "Tlaxcala",
            "urlSlug": "tlaxcala",
            "code": "Tlax.",
            "count": "61"
        },
        {
            "name": "Veracruz",
            "urlSlug": "veracruz",
            "code": "Ver.",
            "count": "61"
        },
        {
            "name": "Yucatan",
            "urlSlug": "yucatan",
            "code": "Yuc.",
            "count": "61"
        },
        {
            "name": "Zacatecas",
            "urlSlug": "zacatecas",
            "code": "Zac.",
            "count": "63"
        }
    ]

    public static timeLinaRating: any = [
        {
            'count': 1,
            'color': false
        },
        {
            'count': 2,
            'color': true
        },
        {
            'count': 3,
            'color': true
        },
        {
            'count': 4,
            'color': false
        },
        {
            'count': 5,
            'color': false
        },
        {
            'count': 6,
            'color': false
        },
        {
            'count': 7,
            'color': false
        },
        {
            'count': 8,
            'color': false
        },
        {
            'count': 9,
            'color': false
        },
        {
            'count': 10,
            'color': false
        },
    ]
    public static information = {

        firstName: ` Add the name of your company's representative who generally manages public communication. This can be used when a lead calls you. They can talk with you personally to build more trust.`,
        lastName: `Add the name of your company's representative who generally manages public communication. This can be used when a lead calls you. They can talk with you personally to build more trust.`,

        website: `As a carrier, maintaining a public website is essential for fostering trust among major shippers and brokers. A company's online presence through a website is indicative of its strength in the market.`,

        overview: `An overview is centered around your experience, expertise, years spent in the business, the number of trucks and equipment you possess, and why someone should hire you. Provide details about your previous experience and other relevant information that can contribute to building trust. Additionally, share your DOT status and any certificates you hold`,
        companySlogan: 'Summarize your work and company in one line; your tagline should encapsulate your service',
        SCAC: 'The Standard Carrier Alpha Code (SCAC) is a unique two-to-four-letter code used to identify transportation companies.',
        DUNS: `The Data Universal Numbering System (DUNS) number is a unique nine-digit identification number provided by Dun & Bradstreet (D&B). The DUNS Number is site-specific. Therefore, each distinct physical location of an entity (such as branches, divisions, and headquarters) may be assigned a DUNS number.`,
        OICState: `FMCSA State office with oversight for this carrier" refers to the state-level office of the Federal Motor Carrier Safety Administration (FMCSA) that has the responsibility of supervising or monitoring a specific carrier.`,
        dotNumber: `The Unique USDOT Number of the Motor Carrier refers to the distinctive identification number assigned by the U.S. Department of Transportation (USDOT) to each individual motor carrier. This number serves as a unique identifier for regulatory and safety purposes, allowing for the precise identification of the carrier within the transportation industry.`,

        numberOfDrivers: `Number of drivers associated with a particular motor carrier or fleet. It represents the count of individuals employed or contracted by the carrier to operate their commercial motor vehicles. These metrics are important for understanding the size and scale of a carrier's operations.`,
        NumberOfTrucks: ` A power unit refers to a motor vehicle that is capable of moving on its own, such as a truck or tractor. The "NBR POWER UNIT" is the count of these motor vehicles within a specific fleet or carrier.`,
        electronicTracking: `These days, electronic tracking is the most widely used utility tool by carriers, allowing shippers to track shipment/ load in real-time. Electronic tracking not only manages electronic documents but also provides essential statistics such as driver speed, travel time, load route, and load visibility.
       Both shippers and carriers can monitor shipment status, whether a shipment/ load delayed or on time, through electronic tracking software. If you are utilizing any electronic tracking software, please inform your leads as it enhances trust and increases the likelihood of quickly winning their business.`,
        truckTypesAndEquipmentTypes: `We understand that as a trucking company or carrier, you likely have more than one type of equipment. Each equipment type generates more leads and enhances your visibility in our system. Shippers and brokers commonly use filters on our platform to search for carriers based on equipment types and location for a perfect match.
        If you own or lease multiple equipment types, we recommend selecting all the checkboxes, but we also advise you to be consistent and loyal in your choices.`,
        targetJobMarket: `You can choose the type of shipment or load you are seeking, enabling brokers and shippers to understand your priorities. Whether your company prefers a long-term contractual rate or a spot rate load based on market demand, we will strategically promote your company profile to the right brokers and shippers at the opportune time.
     If you are uncertain about your target market, you can select the option 'Open for any job,' and we will display your profile to a wide range of potential leads.`,


        availability: 'We understand that you may have a long-term contractual rate for six months or a year, or perhaps you are not actively seeking new leads this month. Simply select the appropriate option, and our system will notify users whether you are currently seeking new loads or not',
        shipmentTypes: 'Specify the types of shipments and loads that align with the assets and business model of your company. Our intelligent system will then promote your business according to your preferences. You have three options; simply select any one, and let our system work its magic for you.',
        fuelConsumptionTypes: 'As many carrier companies operate fleets with diverse vehicles and various fuel consumption options, kindly choose all the available fuel consumption options for your company, along with their corresponding rates per mile. For instance, if you have a standard truck with a fuel option 1 with  consumption rate of 7 miles per gallon and another truck with a more fuel-efficient option 2 with rate of 9 miles per gallon, input these details. This information will empower our system to effectively showcase your business to shippers and brokers based on specific fuel consumption preferences.',

        hazardousMaterials: 'A Hazardous Materials (Hazmat) truck load involves transporting materials that pose a risk to health, safety, and property during transportation.',
        passengerCarrier: 'According to the FMCSA, a "Passenger Carrier" refers to a motor carrier that transports passengers for compensation. This includes companies or individuals involved in the business of transporting passengers, such as buses, motorcoaches, and other types of passenger-carrying vehicles.',
        MCSDate: 'The MCS-150 date, (FMCSA), refers to the date when a motor carriers information was last updated on the Motor Carrier Management Information System (MCMIS). The MCS-150 is a form used by the FMCSA to collect and update information about interstate motor carriers.',
        MCSMileage: 'The MCS-150 Mileage is a figure reported by motor carriers on the MC Identification Report (MCS-150) form, which is submitted to the FMCSA. The MCS-150 Mileage represents the total number of miles traveled by the carriers entire fleet in a specific reporting period.',
        MCSMileageYear: 'The MCS-150 Mileage Year, according to the FMCSA, is the calendar year for which a motor carrier reports its total mileage on the MC Identification Report (MCS-150) form.',
        cargoTypes: 'Motor carriers are required to describe the types of cargo they primarily transport. This information is crucial for regulatory purposes, safety monitoring, and for understanding the nature of a carriers operations. Carriers may use broad categories to describe their cargo types, such as general freight, household goods, hazardous materials, or specific commodities like electronics, machinery, or food products.',
        carrierOperation: 'Carrier operations are categorized based on the type and scope of transportation services they provide. The primary codes identifying carriers type of Operation; Interstate, Intrastate Hazmat, Intrastate Non-Hazmat.',

        MCS150Date: `The MCS-150 date, (FMCSA), refers to the date when a motor carrier's information was last updated on the Motor Carrier Management Information System (MCMIS). The MCS-150 is a form used by the FMCSA to collect and update information about interstate motor carriers.`,
        MCS150Mileage: `The MCS-150 Mileage is a figure reported by motor carriers on the MC Identification Report (MCS-150) form, which is submitted to the FMCSA. The MCS-150 Mileage represents the total number of miles traveled by the carrier's entire fleet in a specific reporting period.`,

       MCS150MileageYear:`The MCS-150 Mileage Year, according to the FMCSA, is the calendar year for which a motor carrier reports its total mileage on the MC Identification Report (MCS-150) form`,

       docketNumber:`A docket number typically refers to a unique identifier assigned to a legal case or proceeding within a court or regulatory agency. It helps track and manage the case's progress, filings, and related documents. The specific context of the docket number can vary depending on the organization or system using it.`,
       resend:'Resend',
       Withdrawal:'Withdrawal',
       view:'View',
       email:'email',
       notEditable:'This input field is not editable',
    //    Subscription Price 
       carrierStarterPrice:'49',
       carrierBusinessPrice:'99',
       NonCarrierStarterPrice:'99',
       NonCarrierBusinessPrice:'199',
       
    };

    
}

