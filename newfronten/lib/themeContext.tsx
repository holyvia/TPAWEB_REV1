import { type } from "os";
import React, { createContext, useContext, useEffect, useState } from "react";



const themeContext = createContext( {} as any);
export function CurrentThemeProvider({ children }: { children: any }) {
    const [theme, setTheme] = useState("light");

    useEffect(()=>{
        const currTheme = localStorage.getItem("theme") || ""
        if(currTheme==""){
            setTheme("light")
        }
        else{
            setTheme(currTheme)
        }
    })

    function changeTheme() {
        const currTheme = localStorage.getItem("theme") || ""
        if(localStorage.getItem('theme') == "light" || currTheme == ""){
            localStorage.setItem('theme', 'dark' )
            setTheme("dark")
        } else{
            localStorage.setItem('theme', 'light')
            setTheme("light")
        }  
        
    }

    function getTheme() {
        // if((localStorage.getItem('theme')) == "light"){
        if(localStorage.getItem('theme')==undefined){
            setTheme('light')
        }
        if( theme== "light"){   
            return {
            
                '--prim': '#f3f2ee',
                // '--prim': '#ff0000',
                '--sec': '#ffffff',
                '--acc':'#0177b7',
                '--hover':'#006da8',
                '--text':'#000000',
                '--text-button':'#ffffff',
                '--fade-text':'#898989',
                '--border':'#d3d3d3',
                '--gray':'#82828'
            }
        }
        else{
            return {
                '--prim': '#000000',
                '--sec': '#383838',
                '--acc':'#0177b7',
                '--hover':'#006da8',
                '--text':'#ffffff',
                '--text-button':'#ffffff',
                '--fade-text':'#cbcbcb',
                '--border':'#dbdbdb',
                '--gray':'#b3b3b3'
              }
        }
        
    }

    const value = { changeTheme, getTheme, theme, setTheme }

    return <themeContext.Provider value={value}>
        {children}
    </themeContext.Provider>
}

export function UseCurrentTheme() {
    return useContext(themeContext)
}
