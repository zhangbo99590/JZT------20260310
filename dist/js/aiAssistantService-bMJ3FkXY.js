var b=Object.defineProperty;var g=(l,t,a)=>t in l?b(l,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):l[t]=a;var u=(l,t,a)=>g(l,typeof t!="symbol"?t+"":t,a);var m=(l,t,a)=>new Promise((i,o)=>{var r=s=>{try{e(a.next(s))}catch(c){o(c)}},n=s=>{try{e(a.throw(s))}catch(c){o(c)}},e=s=>s.done?i(s.value):Promise.resolve(s.value).then(r,n);e((a=a.apply(l,t)).next())});import{ab as f}from"./vendor-antd-DwaELcBr.js";import{a as d}from"./searchUtils-CFgRKCLP.js";const v=[{value:"contract",label:"合同纠纷",color:"blue"},{value:"labor",label:"劳动用工",color:"green"},{value:"tax",label:"财税合规",color:"orange"},{value:"intellectual",label:"知识产权",color:"purple"},{value:"corporate",label:"公司治理",color:"cyan"},{value:"finance",label:"金融法律",color:"red"},{value:"trade",label:"贸易争议",color:"magenta"},{value:"environment",label:"环保合规",color:"lime"},{value:"data",label:"数据合规",color:"geekblue"},{value:"other",label:"其他咨询",color:"default"}];class p{static generatePrefix(t,a){return a.length===0?t:`法律咨询 - 企业场景 - ${a.map(o=>{var r;return(r=v.find(n=>n.value===o))==null?void 0:r.label}).filter(Boolean).join("、")}：${t}`}static detectVagueQuestion(t){return this.VAGUE_KEYWORDS.some(a=>t.includes(a))&&t.length<30}}u(p,"VAGUE_KEYWORDS",["怎么办","如何","能不能","是否","无效","有效","合法"]);const S=l=>[{step:1,question:"请问涉及的主体是什么？（如：公司、个人、合伙企业等）",answer:"",completed:!1},{step:2,question:"请简要描述事实经过（时间、地点、具体行为）",answer:"",completed:!1},{step:3,question:"您的具体诉求是什么？（如：解除合同、赔偿损失、确认效力等）",answer:"",completed:!1},{step:4,question:"目前掌握哪些证据？（如：合同、聊天记录、转账记录等）",answer:"",completed:!1}],w=(a,...i)=>m(null,[a,...i],function*(l,t=[]){yield d(1500+Math.floor(Math.random()*1e3)),p.generatePrefix(l,t);const o=[{name:"《中华人民共和国民法典》",article:"第585条",content:"当事人可以约定一方违约时应当根据违约情况向对方支付一定数额的违约金，也可以约定因违约产生的损失赔偿额的计算方法。约定的违约金低于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以增加；约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。",status:"现行有效",effectiveDate:"2021-01-01"}],r=[{caseId:"CASE001",title:"某科技公司与供应商买卖合同纠纷案",court:"北京市第一中级人民法院",similarity:87},{caseId:"CASE002",title:"制造企业劳动合同竞业限制纠纷案",court:"上海市第二中级人民法院",similarity:75}],n=["建议收集合同原件及相关往来函件作为基础证据","保存违约行为的证据材料（如邮件、短信、录音等）","及时发送书面催告函，明确违约事实和法律后果","评估损失金额，准备损失证明材料","必要时可申请诉前财产保全，防止对方转移资产"];let e=`**核心结论**

`;return e+=`根据您描述的情况，关于"${l.substring(0,30)}${l.length>30?"...":""}"的问题，从法律角度分析如下：

`,e+=`**1. 法律规定**
`,e+=`根据《民法典》第585条规定，合同双方可以约定违约金。违约金具有补偿性和惩罚性双重性质，主要目的是弥补守约方因对方违约所遭受的损失。

`,e+=`**2. 违约金上限**
`,e+=`司法实践中，违约金一般不超过实际损失的30%。如果约定的违约金过分高于造成的损失，守约方可以请求人民法院或仲裁机构予以适当减少。最高人民法院相关司法解释规定，超过实际损失30%的部分可以认定为"过分高于造成的损失"。

`,e+=`**3. 调整标准**
`,e+=`违约金的调整应当以实际损失为基础，综合考虑合同履行情况、当事人的过错程度、预期利益等因素。法院在判断违约金是否过高时，会考虑：
`,e+=`- 合同的实际履行情况
`,e+=`- 守约方的实际损失（包括直接损失和可得利益损失）
`,e+=`- 违约方的过错程度
`,e+=`- 违约金条款的约定是否公平合理

`,e+=`**4. 实务建议**
`,e+=`在合同签订时，违约金的约定应当合理，既要起到督促履约的作用，又要避免过分高于实际损失。建议：
`,e+=`- 违约金数额设置为合同总价的10%-30%较为合理
`,e+=`- 明确约定违约金的计算方式和支付期限
`,e+=`- 可以设置违约金上限条款
`,e+=`- 保留调整违约金的协商空间
`,{id:Date.now().toString(),type:"assistant",content:e,timestamp:f().format("YYYY-MM-DD HH:mm:ss"),legalArticles:o,caseReferences:r,suggestions:n}}),A=()=>{localStorage.removeItem("ai_assistant_history")};export{p as Q,w as a,v as b,A as c,S as g};
