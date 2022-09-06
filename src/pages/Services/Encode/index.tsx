import React,{useState}from "react";
import "./index.less";
export class EncodeProps {}
const lists = [
  {
    id: "001",
    text: "Basic",
    timestamp: new Date().getMilliseconds(),
    done: true
  },
  {
    id: "002",
    text: "Church",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "003",
    text: "Goldman",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "004",
    text: "Grass",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "005",
    text: "CompositeDNA",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "006",
    text: "Zan",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "007",
    text: "Blawat",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "008",
    text: "DNA_Fountain",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
  {
    id: "009",
    text: "Yin_Yang",
    timestamp: new Date().getMilliseconds(),
    done: false,
  },
]
export const Encode: React.FC<EncodeProps> = (props) => {
  
  const [todos,setTodos]=useState(lists)
  const changeTodos=(id:any,done:any)=>{
    //判断传入id（勾选或取消勾选的对应id）
    const newtodo = todos.map((todo)=>{
      if (todo.id === id) return{...todo,done} //如果勾选了就覆盖状态
      else return todo //否则返回原有状态
    })
    setTodos(newtodo) //更改状态，以便显示
  }
  return (
    <div className='todo-container'>
      <div className='todo-wrap'>
        <h2>Choose Decode Method</h2>
        <List todos={todos} changeTodos={changeTodos}/>
        <p>Method details please click the : <a href='../Methods'>Method Paper</a></p>
        <button className='btn btn-danger'>Run</button>
        </div>
    </div>
    
  );
};


// interface IProps {
//   todos: any;
// }

function Item(props:any){
  const {text,done,id} = props
  const [move,setMove]=useState(false)

  const changeState=(id:any)=>{
    return (event:any)=>{
      props.changeTodos(id,event.target.checked)
    }
  }
  //鼠标移入边灰，移出变白
  const handleMouse=(flag:boolean)=>{
    return ()=>{
      setMove(flag)
    }
  }
  return(
    <div >
      <li style={{backgroundColor:move?'#ddd':'white'}} onMouseEnter={handleMouse(true)} onMouseLeave={handleMouse(false)}>
        <label>
          <input checked = {done} onChange={changeState(id)} type={'checkbox'}></input>
          <span id='textType'><strong> {text}</strong></span>
        </label>
      </li>
    </div>
  )
}
function List(props:any){
  const {todos,changeTodos}=props
  
  return (
    <ul className='todo-main'>
      {
      todos.map((todo:any)=>{
        return <Item key={todo.id} {...todo} changeTodos={changeTodos}></Item>
      })
      }
    </ul>
  )
}

Encode.defaultProps = new EncodeProps();