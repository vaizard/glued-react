import React from 'react';

// https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/
// https://lokalise.com/blog/react-i18n-intl/


class CoreWelcome extends React.Component {
    render() {
        return ( <>
            <h1>Welcome</h1>
            <div>This is just a hello message.</div>
        </> );
    }
}


export { CoreWelcome as CoreHello }
