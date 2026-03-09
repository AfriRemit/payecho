import{de as c,db as e,dx as r}from"./index-BvJuXSID.js";import{$ as p}from"./ModalHeader-DfHxv9fE-Bxv8vurS.js";import{e as x}from"./ErrorMessage-D8VaAP5m-CHf9p1K0.js";import{r as f}from"./LabelXs-oqZNqbm_-CAD2fgqW.js";import{p as h}from"./Address-Cbulz6Wu-RPrVcNSs.js";import{d as g}from"./shared-FM0rljBt-PxJXjbO6.js";import{C as j}from"./check-DekIEj6o.js";import{C as u}from"./copy-2H2Mb5Ux.js";let v=r(g)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,y=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,C=r.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,b=r.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,z=r(f)`
  text-align: left;
  margin-bottom: 0.5rem;
`,w=r(x)`
  margin-top: 0.25rem;
`,E=r(p)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;const R=({errMsg:t,balance:s,address:a,className:d,title:n,showCopyButton:m=!1})=>{let[o,l]=c.useState(!1);return c.useEffect((()=>{if(o){let i=setTimeout((()=>l(!1)),3e3);return()=>clearTimeout(i)}}),[o]),e.jsxs("div",{children:[n&&e.jsx(z,{children:n}),e.jsx(v,{className:d,$state:t?"error":void 0,children:e.jsxs(y,{children:[e.jsxs(C,{children:[e.jsx(h,{address:a,showCopyIcon:!1}),s!==void 0&&e.jsx(b,{children:s})]}),m&&e.jsx(E,{onClick:function(i){i.stopPropagation(),navigator.clipboard.writeText(a).then((()=>l(!0))).catch(console.error)},size:"sm",children:e.jsxs(e.Fragment,o?{children:["Copied",e.jsx(j,{size:14})]}:{children:["Copy",e.jsx(u,{size:14})]})})]})}),t&&e.jsx(w,{children:t})]})};export{R as j};
