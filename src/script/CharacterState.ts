export class Context extends Laya.Script{
    protected m_State = null;

    public request(value:number): void {
        this.m_State.handle(value);
    }
    public setState(theState:State):void{
        // console.log("Context.SetState: " + theState);
        this.m_State = theState;
    }
}

export abstract class State extends Laya.Script{
    protected m_Context:Context = null;
    public State(theContext: Context){
        this.m_Context = theContext;
    }
    public abstract handle(value:number);
}


export class CharacterIdleState extends State{
    constructor(context:Context){
        super();
    }
    protected m_Context:Context = null;
    public CharacterIdleState(theContext: Context){
        this.m_Context = super.m_Context;
    }
    public handle(value:number):void{
        // console.log("CharacterIdleState.handle");
        if(value > 10){
            this.m_Context.setState(new CharacterMoveState(this.m_Context));
        }
    }
}

export class CharacterMoveState extends State{
constructor(context:Context){
    super();
}

    protected m_Context:Context = null;
    public CharacterMoveState(theContext: Context){
        this.m_Context = super.m_Context;
    }
    public handle(value:number):void{
        // console.log("CharacterMoveState.handle");
        if(value > 20){
            this.m_Context.setState(new CharacterDashState(this.m_Context));
        }
    }
}

export class CharacterDashState extends State{
    constructor(context:Context){
        super();
    }
    protected m_Context:Context = null;
    public CharacterDashState(theContext: Context){
        this.m_Context = super.m_Context;
    }
    public handle(value:number):void{
        // console.log("CharacterDashState.handle");
        if(value > 20){
            // this.m_Context.setState(new CharacterMoveState());
            // console.log("end");
            
        }
    }
}