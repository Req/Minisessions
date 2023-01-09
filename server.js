import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

// This variable is our sesssions database
const sessions = []

/**
 * Session parsing middleware
 *
 * This looks at the incoming request and checks if there is a session cookie
 * If session cookie is found, tries to find a their session session from list
 * of sesions (the sessions array) and adds it to the request with `req.session`
 */
function joelsSessionParser(req, res, next) {
  if (req.cookies.session_id) {
    req.session = sessions.find(s => s.id === req.cookies.session_id)
  }

  next()
}

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(joelsSessionParser)

app.post("/login", (req, res) => {
  if (req.session) {
    res.status(400)
    res.send({ error: "You are already logged in " + req.session.username })
    return
  }

  console.log(req.body)

  if (!req.body.username) {
    res.status(400).send({ error: "Username missing" })
    return
  }

  const session = {
    id: String(Math.random()),
    username: req.body.username,
  }
  sessions.push(session)

  const mins = 1000*60*5
  res.cookie("session_id", session.id, { maxAge: mins, httpOnly: true })
  res.send({ ok: true })
})

app.get("/sessions", (req, res) => {
  if (!req.session) {
    res.status(400)
    res.send({ error: "Log in first" })
    return
  }

  res.send({ activeSessions: sessions.map(s => s.username) })
})

// The public is to demonstrate a same-origin-request
// The frontend folder is to demonstrate a CORS same-origin-request
app.use(express.static("public"))
app.listen(6999, () => console.log("http://localhost:6999"))
