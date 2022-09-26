import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin/Signin'
import Homepage from './pages/Homepage/Homepage'
import Signup from './pages/Signup/Signup'
import Profile from './pages/Profile/Profile'
import Network from './pages/Network/Network'
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { CurrentUserProvider, UseCurrentUser } from './lib/userContext'
import { ThemeContext } from '@emotion/react'
import { ActAccount } from './pages/ActAccount/ActAccount'
import { ResetPassword } from './pages/ResetPassword/ResetPassword'
import { InputEmailResetPass } from './pages/ResetPassword/InputEmailResetPass'
import { Searching } from './pages/Searching/Searching'
import { offsetLimitPagination } from '@apollo/client/utilities'
import Message from './pages/Message/Message'
import { ProtectedRoute, UnprotectedRoute } from './pages/Middleware/Middleware'
import { Job } from './pages/Job/Job'
import { InputValidationCode } from './pages/ResetPassword/InputValidationCode'
import { SearchingProfile } from './pages/SearchProfile/SearchProfile'
import { SearchingPost } from './pages/SearchPost/SearchPost'
import { Notification } from './pages/Notification/Notification'
import VideoCall from './pages/VideoCall/VideoCall'

function App() {

  const {user} = UseCurrentUser();
  console.log(user);
  
  const auth_link = new ApolloLink((operation: any, forward: any) => {
    if (user && user.token !== undefined) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${user.token}`
        },
      });
    }
    return forward(operation)
  })

  const httpLink = createHttpLink({
    uri: 'http://localhost:7070/query'
  })

  const client = new ApolloClient({
    link : auth_link.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getPosts: offsetLimitPagination(),
            users:offsetLimitPagination(),
            searchpost:offsetLimitPagination()
          },
        },
      },
    }),
  })

  const Protected = () =>{
    return(
      <ProtectedRoute>
        <Outlet></Outlet>
      </ProtectedRoute>
    )
  }
  
  const Unprotected = () =>{
    return(
      <UnprotectedRoute>
        <Outlet></Outlet>
      </UnprotectedRoute>
    )
  }


  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route element={<Protected/>} >
            <Route path="/searchprofile/:subString" element={<SearchingProfile/>}/>
            <Route path="/searchpost/:subString" element={<SearchingPost/>}/>
            <Route path="/search/:subString" element={<Searching/>}/>
            <Route path="/search" element={<Searching/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/network" element={<Network/>}/>
            <Route path="/homepage" element={<Homepage/>}/>
            <Route path='/message/:id' element={<Message />}></Route>
            <Route path='/message' element={<Message />}></Route>
            <Route path='/notification' element={<Notification  />}></Route>
            <Route path="/vidcall/:id" element={<VideoCall />} />
            <Route path="/job" element={<Job/>}/>
          </Route>
          
          
          <Route element={<Unprotected/>}>
            <Route path="/validationcode/:id" element={<InputValidationCode/>}/>
            <Route path="/resetpass/:id" element={<ResetPassword/>}/>
            <Route path="/askforresetlink" element={<InputEmailResetPass/>}/>
            <Route path="/activate/:id" element={<ActAccount/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/" element={<Signin/>}/>
          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  )
}

export default App
