import React, { useEffect, useState } from "react";
import "./Signin.css";
import logo from '../../assets/logo.png'
import logoGoogle from '../../assets/logoGoogle.png'
import { useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGIN_QUERY, REGISTER_FOR_GOOGLE, REGISTER_QUERY, USER_BY_EMAIL } from "../../query/queries";
import { UseCurrentUser } from "../../lib/userContext";
import { UseCurrentTheme } from "../../lib/themeContext";
import { CredentialModel, CredentialResponse, GsiButtonConfiguration, PromptMomentNotification } from "../../lib/GoogleModel";
import { ParseJwt } from "../../lib/Token";
import toast, { Toaster } from "react-hot-toast";
import { Footer } from "../Footer/Footer";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const navigate = useNavigate();
  const [login, { data, loading, error }] = useMutation(LOGIN_QUERY)
  const { getUser, setUserToStr } = UseCurrentUser()
  const { theme, getTheme, changeTheme } = UseCurrentTheme()
  const clientId = "742768215687-7n7vfrfdilq2uvhapamq6r645iebolo6.apps.googleusercontent.com"
  const googleId = window.google?.accounts.id
  const [getUserByEmailFunc] = useLazyQuery(USER_BY_EMAIL)
  const [regis] = useMutation(REGISTER_FOR_GOOGLE)
  function handleSubmit() {
    if (email == "") {
      toast.error("Email can't be empty")
    }
    else if (password == "") {
      toast.error("Password can't be empty");
    }
    else if (!email.includes('@') || !email.includes('.')) {
      toast.error("Email is wrong format")
    }
    else {
      login({
        variables: {
          email: email,
          password: password
        }
      }).then((e) => {
        console.log(e);
        if (data && data.login.token != undefined) {
          const user = data.login
          setUserToStr(user)
          navigate('/homepage')
        }
      }).catch((e) => {
        console.log(e.toString().split(":")[1]);
        if (e.toString().split(":")[1] == " crypto/bcrypt") {
          toast.error("Wrong password")
        }
        else if (e.toString().split(":")[1] == " account is not found") {
          toast.error("account has not been activated yet")
        }
        else {
          toast.error(e.toString().split(":")[1])
        }
      })
    }
  }

  const handleCallBack = (response: CredentialResponse) => {
    console.log(ParseJwt(response.credential as string))
    const credentialData = ParseJwt(response.credential as string) as CredentialModel
    console.log(credentialData);
    getUserByEmailFunc({
      variables: {
        email: credentialData.email
      }
    }).then((e) => {
      if (e.data !== undefined) {
        //login
        console.log(e.data);

        const user = e.data.userByEmail
        setUserToStr(user)
        navigate('/homepage')
      }
      else {
        //register
        const input = {
          name: credentialData.name,
          email: credentialData.email,
          password: "googleAccount!"
        }
        console.log(input);

        regis({
          variables: {
            id: credentialData.sub,
            input: input
          }
        }).then((e) => {
          const user = { ...e.data.registerForGoogle, id: credentialData.sub }
          setUserToStr(user)
          navigate('/homepage')

        }).catch((e) => {
          console.log(e);

        })
      }
    })

  }

  useEffect(() => {
    console.log('running use effect')
    googleId?.initialize({
      client_id: clientId,
      callback: handleCallBack
    })

    googleId?.renderButton
      (
        document.getElementById("GoogleSignIn") as HTMLElement,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signup_with",
          shape: "pill",
          width: "350px",
        } as GsiButtonConfiguration,

      )

    googleId?.prompt((notification: PromptMomentNotification) => {
      notification.isDisplayed()
    })
  }, [])


  return (
    <div className="outerSignIn">
      <div className="login" style={{ ...getTheme() }}>
        <Toaster position="top-center" />
        <img
          src={logo}
          alt=""
        />
        <div className="title">
          <h1>
            Sign In
          </h1>
        </div   >
        <form>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <div className="errorDisplay">
            {errorMes}
          </div>
          <button type="button" onClick={handleSubmit}>
            Sign In
          </button>
        </form>
        <p className="or">or</p>

        <div id="GoogleSignIn"></div>

        <p>
          Not a member?{` `}
          <span className="login__register" onClick={() => navigate('/signup')}>
            Register Now
          </span>
        </p>
        <p onClick={() => navigate('/askforresetlink')}>forget password</p>
        
        <Footer/>
        
      </div>
    </div>
  );
}

export default Signin;
