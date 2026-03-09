import{b_ as j,d9 as n,dj as $,dv as l}from"./index-BuybU9N2.js";import{i as g,m as a,o as d,c as h}from"./ethers-5oa3ZKLD-BiXvHcZX.js";import{C as k}from"./getFormattedUsdFromLamports-B6EqSEho-C-HCdwKa.js";import{t as v}from"./transaction-CnfuREWo-nROljJQP.js";const O=({weiQuantities:e,tokenPrice:i,tokenSymbol:s})=>{let r=a(e),t=i?d(r,i):void 0,o=h(r,s);return n.jsx(c,{children:t||o})},P=({weiQuantities:e,tokenPrice:i,tokenSymbol:s})=>{let r=a(e),t=i?d(r,i):void 0,o=h(r,s);return n.jsx(c,{children:t?n.jsxs(n.Fragment,{children:[n.jsx(y,{children:"USD"}),t==="<$0.01"?n.jsxs(x,{children:[n.jsx(p,{children:"<"}),"$0.01"]}):t]}):o})},D=({quantities:e,tokenPrice:i,tokenSymbol:s="SOL",tokenDecimals:r=9})=>{let t=e.reduce(((u,f)=>u+f),0n),o=i&&s==="SOL"&&r===9?k(t,i):void 0,m=s==="SOL"&&r===9?v(t):`${j(t,r)} ${s}`;return n.jsx(c,{children:o?n.jsx(n.Fragment,{children:o==="<$0.01"?n.jsxs(x,{children:[n.jsx(p,{children:"<"}),"$0.01"]}):o}):m})};let c=l.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,y=l.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,p=l.span`
  font-size: 10px;
`,x=l.span`
  display: flex;
  align-items: center;
`;function S(e,i){return`https://explorer.solana.com/account/${e}?chain=${i}`}const F=e=>n.jsx(b,{href:e.chainType==="ethereum"?g(e.chainId,e.walletAddress):S(e.walletAddress,e.chainId),target:"_blank",children:$(e.walletAddress)});let b=l.a`
  &:hover {
    text-decoration: underline;
  }
`;export{D as f,P as h,O as p,F as v};
