
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

export interface UserSettingsProps {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>
}

const InvestmentSymbol: React.FC<UserSettingsProps> = ({ authService }) => {
  const [charts, setCharts] = useState([]);
  const [news, setNews] = useState([]);
  const [quote, setQuote] = useState();

  
let { symbolId }: any = useParams()
useEffect(() => {
  const fetchData = async () => {
    const { data } = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${symbolId}/batch?types=quote,news,chart&token=pk_d9db58af65374520ace4898a24532312`
    );
    console.log(data)

      setCharts(data.chart);
      setNews(data.news);
      setQuote(data.quote);
    };
    fetchData();
}, [])


  return (
 <div>
<CarouselProvider
naturalSlideWidth={100}
naturalSlideHeight={150}
totalSlides={news.length}
visibleSlides={2}
>
<ButtonBack>Back</ButtonBack>
<ButtonNext style={{float:'right'}}>Next</ButtonNext>
<Slider>
{news && news.map(item =>{
return (
<Slide index={news.indexOf(item)}>
<SymbolArticle authService={authService} article={item}/>
</Slide>
)
})}
</Slider>
</CarouselProvider>
<SymbolChart authService={authService} chartData={charts}/>
 </div>
  );
};

export default InvestmentSymbol;