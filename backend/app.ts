import express from "express";
import path from "path";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import paginate from "express-paginate";
import auth from "./auth";
import userRoutes from "./user-routes";
import contactRoutes from "./contact-routes";
import bankAccountRoutes from "./bankaccount-routes";
import transactionRoutes from "./transaction-routes";
import likeRoutes from "./like-routes";
import commentRoutes from "./comment-routes";
import notificationRoutes from "./notification-routes";
import bankTransferRoutes from "./banktransfer-routes";
import testDataRoutes from "./testdata-routes";
import investmentsRoutes from "./invesments-routes";
import managerRoutes from "./manager";
import axios from 'axios'
import ngrok from 'ngrok'

const port = 3001
require("dotenv").config();


/*
async function establishConnection(){
  const url = await ngrok.connect(port); // [IP_ADDRESS]
  process.env.MY_URL = url; 
  console.log('MY_URL' ,process.env.MY_URL);
}

establishConnection(); 

app.post("/investments", async (req, res) => {
const webhookSecret = req.headers["X-Finnhub-Secret"]
if (webhookSecret === process.env.webhook_SECRET){
await axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=bu85pov48v6ufhqjaq7g')
return res.status(200).json({ webhook: true })
}
return res.status(404).json({ webhook: false })
  })

  */

const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};


const app = express();

/* istanbul ignore next */
// @ts-ignore
if (global.__coverage__) {
  require("@cypress/code-coverage/middleware/express")(app);
}

app.use(cors(corsOption));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(paginate.middleware(+process.env.PAGINATION_PAGE_SIZE!));

app.use(auth);
app.use("/users", userRoutes);
app.use("/contacts", contactRoutes);
app.use("/bankAccounts", bankAccountRoutes);
app.use("/transactions", transactionRoutes);
app.use("/manager", managerRoutes);
app.use("/likes", likeRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/bankTransfers", bankTransferRoutes);
app.use("/investments", investmentsRoutes);

/* istanbul ignore next */
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
  app.use("/testData", testDataRoutes);
}

app.use(express.static(path.join(__dirname, "../public")));

app.listen(port);




