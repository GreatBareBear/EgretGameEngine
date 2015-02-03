/**
 * Created by Saco on 2014/8/2.
 */
class DelayOptManager{
    private TIME_THRESHOLD:number = 3;        //每帧运算逻辑的时间阈值，执行代码超过这个时间就跳过到下一帧继续执行，根据实际情况调整，因为每一帧除了这里的逻辑还有别的逻辑要做
    private _delayOpts:any[];
    private static _instance:DelayOptManager;
    public constructor()
    {
        this._delayOpts = [];
    }

    public static i():DelayOptManager
    {
        if(!this._instance)
            this._instance = new DelayOptManager();
        return this._instance;
    }

    public addDelayOptFunction(thisObj:any, fun:Function, funPara?:any, callBack?:Function, para?:any):void
    {
        this._delayOpts.push({"fun":fun, "funPara":funPara, "thisObj":thisObj, "callBack":callBack, "para":para});
        egret.Ticker.getInstance().register(this.runCachedFun, this);
    }

    private runCachedFun(f:any):void
    {
        if(!this._delayOpts.length)
            egret.Ticker.getInstance().unregister(this.runCachedFun, this);
        var timeFlag = egret.getTimer();
        var funObj:any;
        while(this._delayOpts.length)
        {
            funObj = this._delayOpts.shift();
            if(funObj.funPara != undefined)
                funObj.fun.call(funObj.thisObj, funObj.funPara);
            else
                funObj.fun.call(funObj.thisObj);
            if(funObj.callBack)
            {
                if(funObj.para != undefined)
                    funObj.callBack.call(funObj.thisObj, funObj.para);
                else
                    funObj.callBack();
            }
            if(egret.getTimer() - timeFlag > this.TIME_THRESHOLD)
                break;
        }
    }
}