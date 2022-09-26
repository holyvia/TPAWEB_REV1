export const mentionInputPostStyle = {
    control: {
        backgroundColor: '#fff',
        fontSize: 14,
        fontWeight: 'normal',
    } as React.CSSProperties,

    '&multiLine': {
        control: {
            fontFamily: 'Roboto',
            minHeight: 63,
        },
        highlighter: {
            padding: 9,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
            display: "hidden"
        } as React.CSSProperties,
    } as React.CSSProperties,

    '&singleLine': {
        display: 'inline-block',
        width: 180,

        highlighter: {
            padding: 1,
            border: '2px inset transparent',
        },
        input: {
            padding: 1,
            border: '2px inset',
            display: "hidden"
        },
    } as React.CSSProperties,

    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            color:'black',
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#9dc1fc',
            },
        },
    } as React.CSSProperties,
}

export const mentionInputCommentStyle = {
    control: {
        backgroundColor: '#fff',
        width: "100%",
        fontSize: 14,
        fontWeight: 'normal',
        minHeight: 50,
        maxHeight: "auto"
    } as React.CSSProperties,

    '&multiLine': {
        control: {
            fontFamily: 'Roboto',
            minHeight: 'auto',
        },
        highlighter: {
            padding: 0,
            border: '1px solid transparent',
            minHeight: "50px",
            maxHeight: "auto"
        } as React.CSSProperties,
        input: {
            padding: 9,
            border: '1px solid silver',
            minHeight: "50px",
            maxHeight: "auto",
        } as React.CSSProperties,
    } as React.CSSProperties,

    '&singleLine': {
        display: 'inline-block',
        width: 180,

        highlighter: {
            padding: 1,
            border: '2px inset transparent',
        },
        input: {
            padding: 1,
            border: '2px inset',
        },
    } as React.CSSProperties,

    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#9dc1fc',
            },
        },
    } as React.CSSProperties
}

export const mentionStyle: React.CSSProperties = {
    backgroundColor: "#0078AA",
    opacity: 0.2,
    padding: 1,
    marginLeft: -1,
    borderRadius: 3
}