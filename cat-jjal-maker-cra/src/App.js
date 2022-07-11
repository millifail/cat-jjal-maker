import logo from './logo.svg';
import './App.css';
import React from 'react';
import Title from './components/Title'

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
     return JSON.parse(localStorage.getItem(key));
   },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};







const Form =(props)=>{
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  const [value,setValue] = React.useState('');
  const [errorMessage,setErrormessage] = React.useState('');

  function handleInputChange(e){
    const userValue = e.target.value;

    setErrormessage('');
    if(includesHangul(userValue)){ //한글이 포함되어 있으면
      setErrormessage('한글은 입력 안됨');
    }

    setValue(userValue.toUpperCase());
    console.log(value); 
      
  }

  function HandleSubmit(e){
    e.preventDefault();
    setErrormessage('');

    if (value == ''){  //validation 
      setErrormessage('빈값은 입력할 수 없음');
      return;
    }
    props.updateMainCat(value);

  }

  return(
    <form onSubmit={HandleSubmit}>
      <input 
      type="text" 
      name="name" 
      placeholder="영어 대사를 입력해주세요"
      onChange={handleInputChange}
      value = {value}
      />
      <button type="submit">생성</button>
      <p style={{color:"red"}}>{errorMessage}</p>
    </form>
  )
}

function CatItem(props){
  return(
    <li>
      <img src={props.img}/>  
    </li>
  )
}

//mapping을 통해 배열의 개수만큼 태그를 추가해준다 ( 배열의 개수를 유동적으로 늘리면 태그가 유동적으로 늘어난다)
//key값을 주어서 자식들간의 고유값을 할당한다 (여기서는 url을 키값으로 하였음)
function Favorites(props){
  if (props.favorites.length==0){
    return(
      <div>사진 위 하트를 눌러 사진을 저장해봐요!</div>
    )
  }

  return(
    <ul className="favorites">  
      {props.favorites.map(cat=><CatItem img={cat} key={cat}/>)}
    </ul>    
  )
}


//class 는 className으로 쓴다
const MainCard = (props) =>{
  
  const heartIcon = props.alreadyFavorite ?"💖" :"🤍";

  return(
    <div className="main-card">
      <img
        src={props.img}
        alt="고양이"
        width="400"
      />
      <button 
      onClick={props.onHeartClick}
      >
      {heartIcon}
      </button>
    </div>
  )
}

const App=()=>{
  const CAT1 = "https://images.theconversation.com/files/457052/original/file-20220408-15-pl446k.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip";
  const CAT2 = "https://i.pinimg.com/originals/aa/02/78/aa02780bbc7e6c5e2d52d9b0e919fbf6.jpg";
  const CAT3 = "https://interbalance.org/wp-content/uploads/2021/08/ray-zhuang-Px2Y-sio6-c-unsplash-scaled.jpg";

  // const counterState = React.useState(1);    //1은 state의 초기값
  // const counter = counterState[0];  //카운터 그자체
  // const setCounter = counterState[1];  //카운터를 조작하는 인자 , setCounter를 통해서 counter를 바꿀 수 있음

  const [counter,setCounter] = React.useState(
                                jsonLocalStorage.getItem('counter')
                              );

  const [mainCat,setMainCat] =React.useState(CAT1);
  const [favorites,setFavorites] = React.useState(
    jsonLocalStorage.getItem('favorites')||[]
    );  //앞에 게 null이면 뒤에거를 사용


  const 하트이미누름 = favorites.includes(mainCat);

  async function setIntialCat(){
    const newCat = await fetchCat('first cat');
    setMainCat(newCat);
  }

  //react component안의 코드는 기본적으로 ui가 새로 업데이트될 때마다 계속 불린다
  //다만 여기서 어떤상태가 업데이트 될때만 불려라 하고 싶을 때 useEffect의 두번째 인자로 
  //배열을 넘기고,  거기에 원하는 상태를 넘겨주면 된다
  //근데 상태는 상관없고, 앱이 맨 처음에 생성되었을 때만 호출하고 싶다면 빈배열을 넘긴다.
  React.useEffect(()=>{  
    setIntialCat();
  },[])
  
  

  async function updateMainCat(value){
    const newCat = await fetchCat(value);

    setMainCat(newCat);


    //const nextCounter = counter+1
    //setCounter(nextCounter);
    //jsonLocalStorage.setItem('counter',nextCounter);

    setCounter((prev)=>{
      const nextCounter = prev+1;
      jsonLocalStorage.setItem('counter',nextCounter);
      return nextCounter

    })
  }

  const HandleHeartClick=()=>{
    const nextFavorites =[...favorites, mainCat]; 
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites',nextFavorites);
  }

  const initalCounter = counter===null ? "":counter+ "번째 ";

  return(
    <div>
      <Title>{initalCounter}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat}/>
      <MainCard img={mainCat} onHeartClick={HandleHeartClick} alreadyFavorite = {하트이미누름}/>
      <Favorites favorites = {favorites}/>
    </div>
  )
}

export default App;
