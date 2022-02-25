import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

// const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/')}
  const redirectToArticles = () => { navigate('/articles')}

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    axios.post(loginUrl,{ username, password })
    .then(res => {
      // debugger
      setSpinnerOn(true)
      localStorage.setItem('token', res.data.token)
      setMessage(res.data.message)
      redirectToArticles()
    })
    .catch(err => {
      debugger
      console.error(err)
    })
    .finally(setSpinnerOn(false))
    // debugger
    // setMessage('')
  }
  
  const getArticles = () => {
    axiosWithAuth().get()
    .then(res => {
      // debugger
      setSpinnerOn(true)
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      debugger
      console.error(err)
      if(err.response.status === 401){
        return redirectToLogin()
      }
    })
  }
  
  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth().post(article) 
    .then(res => {
      debugger
      setSpinnerOn(true)
      setArticles()
      setMessage(res.data.message)
    })
    .catch(err => {
      // debugger
      console.error(err)
    })
    .finally(setSpinnerOn(false))
  }
  // "title": "foo", "text": "bar", "topic": "React"
  
  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    
    // axiosWithAuth().post(article) 
    // .then(res => {
    //   debugger
    //   // setSpinnerOn(true)
    //   // setArticles()
    //   // setMessage(res.data.message)
    // })
    // .catch(err => {
    //   debugger
    //   console.error(err)
    //   if(err.response.status === 401){
    //     return redirectToLogin()
    //   }else{
    //     console.error(err)
    //   }
    // })
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner />
      <Message />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle = {postArticle} articles = {articles} />
              <Articles articles = {articles} getArticles = {getArticles}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}