import{n as e}from"./joinUrl-Bra5o9kv.js";import{t}from"./jsx-runtime-BcqRK4R-.js";import{n,s as r}from"./CategoryHeading-CO9HpbDH.js";import{b as i}from"./DropdownMenu-B_fKayxm.js";import{t as a}from"./SchemaView-B5TRhzre.js";import{c as o,o as s,s as c}from"./openapi-C6WKIbip.js";import{t as l}from"./Toc-C8NcwUoc.js";import{t as u}from"./Button-CnInqkBo.js";import{n as d,r as f,t as p}from"./Collapsible-WJGtPzjJ.js";import{t as m}from"./slugify-BVr6s_qz.js";import{c as h,l as g}from"./Item-BnoX9ivc.js";var _=t(),v=c(`
  query GetSchemas($input: JSON!, $type: SchemaType!) {
    schema(input: $input, type: $type) {
      title
      description
      summary
      components {
        schemas {
          name
          schema
          extensions
        }
      }
    }
  }
`);function y(){let{input:t,type:c,versions:y,version:b,options:x}=s(),{data:S}=e(o(v,{input:t,type:c})),C=S.schema.title,w=S.schema.components?.schemas??[],T=Object.entries(y).length>1,E=x?.showVersionSelect===`always`||T&&x?.showVersionSelect!==`hide`;return w.length?(0,_.jsxs)(`div`,{className:`grid grid-cols-(--sidecar-grid-cols) gap-8 justify-between`,"data-pagefind-filter":`section:openapi`,"data-pagefind-meta":`section:openapi`,children:[(0,_.jsx)(g,{name:`category`,children:C}),(0,_.jsxs)(r,{children:[(0,_.jsxs)(`title`,{children:[`Schemas `,E?b:``]}),(0,_.jsx)(`meta`,{name:`description`,content:`List of schemas used by the API.`})]}),(0,_.jsxs)(`div`,{className:`pt-(--padding-content-top) pb-(--padding-content-bottom)`,children:[(0,_.jsx)(h,{title:C,heading:`Schemas`,headingId:`schemas`}),(0,_.jsx)(`hr`,{className:`my-8`}),(0,_.jsx)(`div`,{className:`flex flex-col gap-y-5`,children:w.map(e=>(0,_.jsxs)(p,{className:`group`,defaultOpen:!0,children:[(0,_.jsxs)(n,{registerNavigationAnchor:!0,level:2,className:`flex items-center gap-1 justify-between w-fit`,id:m(e.name),children:[e.name,` `,(0,_.jsx)(f,{asChild:!0,children:(0,_.jsx)(u,{variant:`ghost`,size:`icon`,className:`size-6`,children:(0,_.jsx)(i,{size:16,className:`group-data-[state=open]:rotate-90 transition cursor-pointer`})})})]}),(0,_.jsx)(d,{className:`mt-4 CollapsibleContent`,children:(0,_.jsx)(a,{schema:e.schema,hideRootRef:!0})})]},e.name))})]}),(0,_.jsx)(l,{entries:w.map(e=>({id:m(e.name),text:e.name,depth:1}))})]}):(0,_.jsxs)(`div`,{children:[(0,_.jsxs)(r,{children:[(0,_.jsxs)(`title`,{children:[`Schemas `,E?b:``]}),(0,_.jsx)(`meta`,{name:`description`,content:`List of schemas used by the API.`})]}),`No schemas found`]})}export{y as SchemaList};
//# sourceMappingURL=SchemaList-DoiW6WqI.js.map