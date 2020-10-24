import React, {useState, useEffect} from 'react'
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import { Interpreter } from "xstate";

export interface Props {
    authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
    article: article
  }

  interface article {
    datetime: number; 
    headline: string; 
    source: string;
    url: string;
    summary: string;
    related: string;
    image: string;
    lang: string;
    hasPaywall: boolean;
  }

const Article: React.FC<Props> = ({ authService, article}) => {
  const [showMore, setShowMore] = useState(false);
  const [summary, setSummary] = useState('');

  // function extendSummary(){
  //   setSummary(article.summary);
  //   setShowMore(true);
  // }

  // function checkSummaryLen(){
  //   if (article.summary.length > 50){
  //     setSummary(article.summary.substr(0,49));
  //   }
  //   else {
  //     setSummary(article.summary);
  //     setShowMore(true);
  //   }
  // }
  // useEffect(() => {
  //     checkSummaryLen();
  // }, []);

      return (
        <div style={{objectFit: 'contain', width:'350px', padding:'10px'}}>
          <h4 style={{margin:'0', overflowY:'auto', height:'20px'}}>{article.headline}</h4>
          <img src={article.image} width="300" height="200"/>
          <p style={{marginTop:'0', whiteSpace:'nowrap'}}>{article.source} | {new Date(article.datetime).toDateString() + ", " + new Date(article.datetime).toLocaleString().substr(12, 11)}</p>
          <p style={{overflow:"auto", height:"75px"}}>{article.summary}
          {/* {!showMore && <span onClick={extendSummary}><u style={{color:'blue', cursor:'pointer'}}>show more...</u></span>} */}
          </p>
<a href={article.url} target="_blank">Full article</a>
        </div>
    )
}

export default Article
