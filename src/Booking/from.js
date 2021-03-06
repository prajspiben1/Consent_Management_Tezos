import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export default function Asynchronous(props) {


    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const response = await fetch(
                "https://cors-anywhere.herokuapp.com/https://travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com/data/en-GB/cities.json",
                {
                    headers: {
                        "x-rapidapi-host":
                            "travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com",
                        "x-rapidapi-key":
                            "",
                        "x-access-token": ""
                    }
                }
            );
            await sleep(1e3); // For demo purposes.
            const countries = await response.json();

            if (active) {
                setOptions(Object.keys(countries).map((key) => countries[key]));
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    return (
        <Autocomplete
            id="from"
            style={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionLabel={option => option.code}
            options={options}
            onChange={(event, value) => {
                props.from(value.code);
            }}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="From"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />

    );

}


