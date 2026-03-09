import{dD as A,da as k,d7 as z,dc as o,f2 as I,dJ as E,ez as b,eA as C,d9 as t,dz as M,dv as p,ck as N,ch as O,f3 as $}from"./index-BuybU9N2.js";import{h as q}from"./CopyToClipboard-DSTf_eKU-Cd7dNFo6.js";import{a as P}from"./Layouts-BlFm53ED-BTmrC7TL.js";import{a as F,i as J}from"./JsonTree-aPaJmPx7-CBP7dzAn.js";import{n as V}from"./ScreenLayout-BdRrZJd_-896JGfqr.js";import{c as H}from"./createLucideIcon-XhgH7b6N.js";import"./ModalHeader-DfHxv9fE-7HNQj4PM.js";import"./Screen-CDEd4p2a-DOMNxBlU.js";import"./index-Dq_xe9dz-Bxg2KT0l.js";const W=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],K=H("square-pen",W),Q=p.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let B=e=>{if(!N(e))return e;try{let a=O(e);return a.includes("�")?e:a}catch{return e}},G=e=>{try{let a=$.decode(e),s=new TextDecoder().decode(a);return s.includes("�")?e:s}catch{return e}},X=e=>{let{types:a,primaryType:s,...l}=e.typedData;return t.jsxs(t.Fragment,{children:[t.jsx(te,{data:l}),t.jsx(q,{text:(i=e.typedData,JSON.stringify(i,null,2)),itemName:"full payload to clipboard"})," "]});var i};const Y=({method:e,messageData:a,copy:s,iconUrl:l,isLoading:i,success:g,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:y,onClose:u})=>t.jsx(V,{title:s.title,subtitle:s.description,showClose:!0,onClose:u,icon:K,iconVariant:"subtle",helpText:x?t.jsx(ee,{children:x}):void 0,primaryCta:{label:s.buttonText,onClick:c,disabled:i||g||m,loading:i},secondaryCta:d?{label:"Not now",onClick:y,disabled:i||g||m}:void 0,watermark:!0,children:t.jsxs(P,{children:[l?t.jsx(Q,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,t.jsxs(Z,{children:[e==="personal_sign"&&t.jsx(w,{children:B(a)}),e==="eth_signTypedData_v4"&&t.jsx(X,{typedData:a}),e==="solana_signMessage"&&t.jsx(w,{children:G(a)})]})]})}),ue={component:()=>{let{authenticated:e}=A(),{initializeWalletProxy:a,closePrivyModal:s}=k(),{navigate:l,data:i,onUserCloseViaDialogOrKeybindRef:g}=z(),[m,x]=o.useState(!0),[d,c]=o.useState(""),[y,u]=o.useState(),[f,T]=o.useState(null),[_,S]=o.useState(!1);o.useEffect((()=>{e||l("LandingScreen")}),[e]),o.useEffect((()=>{a(I).then((n=>{x(!1),n||(c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))}))}),[]);let{method:j,data:R,confirmAndSign:v,onSuccess:D,onFailure:L,uiOptions:r}=i.signMessage,U={title:r?.title||"Sign message",description:r?.description||"Signing this message will not cost you any fees.",buttonText:r?.buttonText||"Sign and continue"},h=n=>{n?D(n):L(y||new E(new b("The user rejected the request.",C.E4001_USER_REJECTED_REQUEST.eipCode))),s({shouldCallAuthOnSuccess:!1}),setTimeout((()=>{T(null),c(""),u(void 0)}),200)};return g.current=()=>{h(f)},t.jsx(Y,{method:j,messageData:R,copy:U,iconUrl:r?.iconUrl&&typeof r.iconUrl=="string"?r.iconUrl:void 0,isLoading:_,success:f!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:r?.isCancellable,onSign:async()=>{S(!0),c("");try{let n=await v();T(n),S(!1),setTimeout((()=>{h(n)}),M)}catch(n){console.error(n),c("An error has occurred, please try again."),u(new E(new b(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(f)})}};let Z=p.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ee=p.p`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-error-dark);
    font-size: 14px;
    line-height: 22px;
  }
`,te=p(F)`
  margin-top: 0;
`,w=p(J)`
  margin-top: 0;
`;export{ue as SignRequestScreen,Y as SignRequestView,ue as default};
