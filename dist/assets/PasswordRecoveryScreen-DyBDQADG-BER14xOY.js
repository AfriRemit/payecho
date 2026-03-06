import{d9 as a,dA as R,d7 as T,d4 as _,d6 as e,el as E,em as U,dU as W,ds as u,e3 as F}from"./index-DGL4G05e.js";import{F as N}from"./ShieldCheckIcon-l4aTeUC0.js";import{m as O}from"./ModalHeader-DfHxv9fE-BimPcHBH.js";import{l as V}from"./Layouts-BlFm53ED-D1Q2viDY.js";import{g as H,h as z,u as M,b as B,k as D}from"./shared-Bw0pXSOO-B_x4Xcel.js";import{w as t}from"./Screen-CDEd4p2a-CZcohBSa.js";import"./index-Dq_xe9dz-B1JPtjGv.js";const re={component:()=>{let[o,h]=a.useState(!0),{authenticated:p,user:g}=R(),{walletProxy:y,closePrivyModal:m,createAnalyticsEvent:v,client:b}=T(),{navigate:j,data:k,onUserCloseViaDialogOrKeybindRef:A}=_(),[n,C]=a.useState(void 0),[x,l]=a.useState(""),[d,f]=a.useState(!1),{entropyId:c,entropyIdVerifier:$,onCompleteNavigateTo:w,onSuccess:S,onFailure:I}=k.recoverWallet,i=(r="User exited before their wallet could be recovered")=>{m({shouldCallAuthOnSuccess:!1}),I(typeof r=="string"?new W(r):r)};return A.current=i,a.useEffect((()=>{if(!p)return i("User must be authenticated and have a Privy wallet before it can be recovered")}),[p]),e.jsxs(t,{children:[e.jsx(t.Header,{icon:N,title:"Enter your password",subtitle:"Please provision your account on this new device. To continue, enter your recovery password.",showClose:!0,onClose:i}),e.jsx(t.Body,{children:e.jsx(K,{children:e.jsxs("div",{children:[e.jsxs(H,{children:[e.jsx(z,{type:o?"password":"text",onChange:r=>(s=>{s&&C(s)})(r.target.value),disabled:d,style:{paddingRight:"2.3rem"}}),e.jsx(M,{style:{right:"0.75rem"},children:o?e.jsx(B,{onClick:()=>h(!1)}):e.jsx(D,{onClick:()=>h(!0)})})]}),!!x&&e.jsx(L,{children:x})]})})}),e.jsxs(t.Footer,{children:[e.jsx(t.HelpText,{children:e.jsxs(V,{children:[e.jsx("h4",{children:"Why is this necessary?"}),e.jsx("p",{children:"You previously set a password for this wallet. This helps ensure only you can access it"})]})}),e.jsx(t.Actions,{children:e.jsx(Y,{loading:d||!y,disabled:!n,onClick:async()=>{f(!0);let r=await b.getAccessToken(),s=E(g,c);if(!r||!s||n===null)return i("User must be authenticated and have a Privy wallet before it can be recovered");try{v({eventName:"embedded_wallet_recovery_started",payload:{walletAddress:s.address}}),await y?.recover({accessToken:r,entropyId:c,entropyIdVerifier:$,recoveryPassword:n}),l(""),w?j(w):m({shouldCallAuthOnSuccess:!1}),S?.(s),v({eventName:"embedded_wallet_recovery_completed",payload:{walletAddress:s.address}})}catch(P){U(P)?l("Invalid recovery password, please try again."):l("An error has occurred, please try again.")}finally{f(!1)}},$hideAnimations:!c&&d,children:"Recover your account"})}),e.jsx(t.Watermark,{})]})]})}};let K=u.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,L=u.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: var(--privy-color-error);
  text-align: left;
  margin-top: 0.5rem;
`,Y=u(O)`
  ${({$hideAnimations:o})=>o&&F`
      && {
        // Remove animations because the recoverWallet task on the iframe partially
        // blocks the renderer, so the animation stutters and doesn't look good
        transition: none;
      }
    `}
`;export{re as PasswordRecoveryScreen,re as default};
