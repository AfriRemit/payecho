import{dF as I,dc as k,d9 as C,de as y,db as e,eE as g,eq as x,dB as R,dx as U}from"./index-B7-tozW1.js";import{F as W}from"./ExclamationTriangleIcon--td69VOH.js";import{F as P}from"./LockClosedIcon-CGLG7Zxw.js";import{T as w,k as v,u as j}from"./ModalHeader-DfHxv9fE-BcXmVzKL.js";import{r as A}from"./Subtitle-CV-2yKE4-Bx_EBKcD.js";import{e as S}from"./Title-BnzYV3Is-BoW4F9Oy.js";const M=U.div`
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
`,N={component:()=>{let{user:t}=I(),{client:b,walletProxy:u,refreshSessionAndUser:$,closePrivyModal:s}=k(),r=C(),{entropyId:m,entropyIdVerifier:T}=r.data?.recoverWallet,[a,f]=y.useState(!1),[i,E]=y.useState(null),[l,h]=y.useState(null);function n(){if(!a){if(l)return r.data?.setWalletPassword?.onFailure(l),void s();if(!i)return r.data?.setWalletPassword?.onFailure(Error("User exited set recovery flow")),void s()}}r.onUserCloseViaDialogOrKeybindRef.current=n;let F=!(!a&&!i);return e.jsxs(e.Fragment,l?{children:[e.jsx(w,{onClose:n},"header"),e.jsx(M,{$color:"var(--privy-color-error)",style:{alignSelf:"center"},children:e.jsx(W,{height:38,width:38,stroke:"var(--privy-color-error)"})}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Something went wrong"}),e.jsx(g,{style:{minHeight:"2rem"}}),e.jsx(v,{onClick:()=>h(null),children:"Try again"}),e.jsx(j,{})]}:{children:[e.jsx(w,{onClose:n},"header"),e.jsx(P,{style:{width:"3rem",height:"3rem",alignSelf:"center"}}),e.jsx(S,{style:{marginTop:"0.5rem"},children:"Automatically secure your account"}),e.jsx(A,{style:{marginTop:"1rem"},children:"When you log into a new device, you’ll only need to authenticate to access your account. Never get logged out if you forget your password."}),e.jsx(g,{style:{minHeight:"2rem"}}),e.jsx(v,{loading:a,disabled:F,onClick:()=>(async function(){f(!0);try{let o=await b.getAccessToken(),c=x(t,m);if(!o||!u||!c)return;if(!(await u.setRecovery({accessToken:o,entropyId:m,entropyIdVerifier:T,existingRecoveryMethod:c.recoveryMethod,recoveryMethod:"privy"})).entropyId)throw Error("Unable to set recovery on wallet");let d=await $();if(!d)throw Error("Unable to set recovery on wallet");let p=x(d,c.address);if(!p)throw Error("Unabled to set recovery on wallet");E(!!d),setTimeout((()=>{r.data?.setWalletPassword?.onSuccess(p),s()}),R)}catch(o){h(o)}finally{f(!1)}})(),children:i?"Success":"Confirm"}),e.jsx(j,{})]})}};export{N as SetAutomaticRecoveryScreen,N as default};
