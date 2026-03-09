import{dc as c,d9 as e,dv as r}from"./index-BuybU9N2.js";import{$ as p}from"./ModalHeader-DfHxv9fE-7HNQj4PM.js";import{e as f}from"./ErrorMessage-D8VaAP5m-BcmAcFZO.js";import{r as x}from"./LabelXs-oqZNqbm_-DFQ6ffPU.js";import{p as h}from"./Address-Cbulz6Wu-ItCUBNCB.js";import{d as g}from"./shared-FM0rljBt-Tn0gIMrn.js";import{C as j}from"./check-De09pplt.js";import{C as u}from"./copy-Bempzjdj.js";let v=r(g)`
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
`,z=r.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,b=r(x)`
  text-align: left;
  margin-bottom: 0.5rem;
`,w=r(f)`
  margin-top: 0.25rem;
`,E=r(p)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;const R=({errMsg:t,balance:s,address:a,className:d,title:n,showCopyButton:m=!1})=>{let[o,l]=c.useState(!1);return c.useEffect((()=>{if(o){let i=setTimeout((()=>l(!1)),3e3);return()=>clearTimeout(i)}}),[o]),e.jsxs("div",{children:[n&&e.jsx(b,{children:n}),e.jsx(v,{className:d,$state:t?"error":void 0,children:e.jsxs(y,{children:[e.jsxs(C,{children:[e.jsx(h,{address:a,showCopyIcon:!1}),s!==void 0&&e.jsx(z,{children:s})]}),m&&e.jsx(E,{onClick:function(i){i.stopPropagation(),navigator.clipboard.writeText(a).then((()=>l(!0))).catch(console.error)},size:"sm",children:e.jsxs(e.Fragment,o?{children:["Copied",e.jsx(j,{size:14})]}:{children:["Copy",e.jsx(u,{size:14})]})})]})}),t&&e.jsx(w,{children:t})]})};export{R as j};
