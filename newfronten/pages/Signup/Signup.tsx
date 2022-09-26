import React, { useEffect, useState } from "react";
import "./Signup.css";
import logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom";
import logoGoogle from '../../assets/logoGoogle.png'
import { useMutation, useLazyQuery } from "@apollo/client";
import { REGISTER_FOR_GOOGLE, REGISTER_QUERY, USER_BY_EMAIL } from "../../query/queries";
import toast, { Toaster } from "react-hot-toast";
import { UseCurrentTheme } from "../../lib/themeContext";
import { ParseJwt } from "../../lib/Token";
import { CredentialModel, CredentialResponse, GsiButtonConfiguration, PromptMomentNotification } from "../../lib/GoogleModel";
import { UseCurrentUser } from "../../lib/userContext";
import { Footer } from "../Footer/Footer";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMes, setErrorMes] = useState("");
  const navigate = useNavigate();
  const [regis, { loading }] = useMutation(REGISTER_QUERY);
  const { getTheme } = UseCurrentTheme()
  const clientId = "742768215687-7n7vfrfdilq2uvhapamq6r645iebolo6.apps.googleusercontent.com"
  const googleId = window.google?.accounts.id
  const [getUserByEmailFunc] = useLazyQuery(USER_BY_EMAIL)
  const [register] = useMutation(REGISTER_FOR_GOOGLE)
  const {setUserToStr} = UseCurrentUser()


  function handleSubmit() {
    if (name == "") {
      toast.error("Name can't be empty")
    }
    else if (email == "") {
      toast.error("Email can't be empty")
    }
    else if (!email.includes('@') || !email.includes('.') ) {
      toast.error("Email is in wrong format")
    }
    else if (password == "") {
      toast.error("Password can't be empty")
    }
    else if (confPassword != password) {
      setErrorMes("Password is not match!");
    }
    else {
      const input = {
        name: name,
        email: email,
        password: password
      }
      console.log(input);

      regis({
        variables: {
          input: input
        }
      }).then((e) => {
        navigate('/')
      }).catch((e) => {
        console.log(e);
        if (e.toString().split(":")[1] == " must not be null") {
          toast.error("Email is used in another account")
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
    }).then((e:any) => {
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

        register({
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
    <div className="login" style={{ ...getTheme() }}>
      <Toaster position="top-center" />
      <img
        src={logo}
        alt=""
      />
      <div className="title">
        <h1>
          Sign Up
        </h1>
      </div>
      <form>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          type="text"
        />
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
        <input
          value={confPassword}
          onChange={(e) => setConfPassword(e.target.value)}
          placeholder="Confirm Password"
          type="password"
        />
        <div className="errorDisplay">
          {errorMes}
        </div>
        <button type="button" onClick={handleSubmit}>
          Sign Up
        </button>
      </form>
      <p className="or">or</p>

      <div id="GoogleSignIn"></div>


      <p>
        Already Have Account{` `}
        <span className="login__register" onClick={() => navigate('/')}>
          Login
        </span>
      </p>
      <Footer/>
    </div>
  );
}

export default Signup;
