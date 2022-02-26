import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
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
    setSpinnerOn(true)
    axios.post(loginUrl,{ username, password })
    .then(res => {
      // debugger
      localStorage.setItem('token', res.data.token)
      setMessage(res.data.message)
      redirectToArticles()
    })
    .catch(err => {
      debugger
      console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
    // debugger
  }
  
  const getArticles = () => {
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
    .then(res => {
      // debugger
      setArticles(res.data.articles)
      setMessage(res.data.message)
    })
    .catch(err => {
      // debugger
      console.error(err)
      if(err.response.status === 401){
        return redirectToLogin()
      }
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }
  
  const postArticle = article => {
    axiosWithAuth().post(articlesUrl, article) 
    .then(res => {
      // debugger
      setSpinnerOn(true)
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
    })
    .catch(err => {
      // debugger
      console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  }
  
  const updateArticle = ({ article_id, article }) => {    
    axiosWithAuth().put(`articlesUrl/${article_id}`, article) 
    .then(res => {
      console.log(res)
      setArticles(articles.map( art => {
        art.id === article_id ? res.data.article : art
      }))
      setMessage(res.data.message)
      setCurrentArticleId(null)
      // setSpinnerOn(true)
    })
    .catch(err => {
      debugger
      console.error(err)
    })
  }
  
  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`articlesUrl/${article_id}`) 
    .then(res => {
      debugger
      setArticles(articles.filter( (art) => {
        art.id !== article_id
      }))
      setMessage(res.data.message)
    })
    .catch(err => {
      console.error(err)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on = {spinnerOn} />
      <Message message = {message} />
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
              <ArticleForm postArticle = {postArticle} articles = {articles} updateArticle = {updateArticle} currentArticleId = {currentArticleId} />
              <Articles articles = {articles} getArticles = {getArticles} setCurrentArticleId = {setCurrentArticleId} deleteArticle = {deleteArticle} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}