import{dA as C,d7 as E,d4 as F,d9 as y,d6 as e,ez as g,el as w,dw as R,ds as U}from"./index-DGL4G05e.js";import{F as W}from"./ExclamationTriangleIcon-BMeDNfUR.js";import{F as A}from"./LockClosedIcon-3w7dtUpc.js";import{T as x,k as v,u as j}from"./ModalHeader-DfHxv9fE-BimPcHBH.js";import{r as P}from"./Subtitle-CV-2yKE4-C0L8TzuI.js";import{e as S}from"./Title-BnzYV3Is-C2DUQNaj.js";const M=U.div`
  && {
    border-width: 4px;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  aspect-ratio: 1;
  border-style: solid;
  border-color: ${t=>t.$color??"var(--privy-color-accent)"};
  border-radius: 50%;
`,O={component:()=>{let{user:t}=C(),{client:$,walletProxy:u,refreshSessionAndUser:b,closePrivyModal:s}=E(),r=F(),{entropyId:m,entropyIdVerifier:T}=r.data?.recoverWallet,[a,f]=y.useState(!1),[l,I]=y.useState(null),[i,h]=y.useState(null);function n(){if(!a){if(i)return r.data?.setWalletPassword?.onFailure(i),void s();if(!l)return r.data?.setWalletPassword?.onFailure(Error("User exited set recovery flow")),void s()}}r.onUserCloseViaDialogOrKeybindRef.current=n;let k=!(!a&&!l);return e.jsxs(e.Fragment,i?{children:[e.jsx(x,{onClose:n},"header"),e.jsx(M,{$color:"var(--privy-color-error)",style:{alignSelf:"center"},children:e.jsx(W,{height:38,width:38,stroke:"var(--privy-color-error)"})}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Something went wrong"}),e.jsx(g,{style:{minHeight:"2rem"}}),e.jsx(v,{onClick:()=>h(null),children:"Try again"}),e.jsx(j,{})]}:{children:[e.jsx(x,{onClose:n},"header"),e.jsx(A,{style:{width:"3rem",height:"3rem",alignSelf:"center"}}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Automatically secure your account"}),e.jsx(P,{style:{marginTop:"1rem"},children:"When you log into a new device, you’ll only need to authenticate to access your account. Never get logged out if you forget your password."}),e.jsx(g,{style:{minHeight:"2rem"}}),e.jsx(v,{loading:a,disabled:k,onClick:()=>(async function(){f(!0);try{let o=await $.getAccessToken(),c=w(t,m);if(!o||!u||!c)return;if(!(await u.setRecovery({accessToken:o,entropyId:m,entropyIdVerifier:T,existingRecoveryMethod:c.recoveryMethod,recoveryMethod:"privy"})).entropyId)throw Error("Unable to set recovery on wallet");let d=await b();if(!d)throw Error("Unable to set recovery on wallet");let p=w(d,c.address);if(!p)throw Error("Unabled to set recovery on wallet");I(!!d),setTimeout((()=>{r.data?.setWalletPassword?.onSuccess(p),s()}),R)}catch(o){h(o)}finally{f(!1)}})(),children:l?"Success":"Confirm"}),e.jsx(j,{})]})}};export{O as SetAutomaticRecoveryScreen,O as default};
