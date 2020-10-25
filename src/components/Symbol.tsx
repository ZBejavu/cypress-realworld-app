
import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton } from "@material-ui/core";
import { User } from "../models";
import {
  Link,
  useParams
} from "react-router-dom";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import axios from "axios";
import SymbolArticle from './SymbolArticle'
import SymbolChart from './SymbolChart'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import SymbolTrade from "./SymbolTrade";
import { Quote } from "models/stockmarket";

export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
}

const InvestmentSymbol: React.FC<UserSettingsProps> = ({ authService }) => {
  const [charts, setCharts] = useState([]);
  const [news, setNews] = useState([]);
  const [quote, setQuote] = useState<any>();

let { symbolId }: any = useParams()

useEffect(() => {
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:3001/investments/stocks/${symbolId}`
    );
      setCharts(data.chart);
      setNews(data.news);
      setQuote(data.quote);
    };
    fetchData();
}, [])

  return (
 <div style={{marginLeft:'-100px', width:'1100px'}}>
<SymbolTrade authService={authService} quote={quote as Quote}/>
<SymbolChart authService={authService} chartData={charts}/>
<CarouselProvider
naturalSlideWidth={100}
naturalSlideHeight={105}
step={3}
isPlaying={true}
interval={10000}
totalSlides={news.length}
visibleSlides={3}
>
<ButtonBack style={{background:'transparent', border:'none'}}>
<Button color='primary'>Back</Button>
</ButtonBack>
<ButtonNext style={{float:'right', background:'transparent', border:'none'}}>
<Button color='primary'>Next</Button>
</ButtonNext>
<Slider style={{background:'#f1f1f1'}}>
{news && news.map(item =>{
return (
<Slide index={news.indexOf(item)}>
<SymbolArticle authService={authService} article={item}/>
</Slide>
)
})}
</Slider>
</CarouselProvider>
 </div>
  );
};

export default InvestmentSymbol;
