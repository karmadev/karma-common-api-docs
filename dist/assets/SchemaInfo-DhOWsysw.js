import{n as e,r as t}from"./joinUrl-Bra5o9kv.js";import{t as n}from"./jsx-runtime-BcqRK4R-.js";import{r,s as i}from"./CategoryHeading-CO9HpbDH.js";import{t as a}from"./createLucideIcon-Da3dwJUI.js";import{c as o,o as s,s as c}from"./openapi-C6WKIbip.js";import{n as l,t as u}from"./Badge-CTUZ8sjA.js";import{a as d,i as f,n as p,r as m,t as h}from"./Card-p1W2iDsK.js";import{t as g}from"./Button-CnInqkBo.js";import{t as _}from"./Markdown-BC32-LbF.js";import{n as v,r as y,t as b}from"./Popover-DDzmvFZB.js";import{t as x}from"./slugify-BVr6s_qz.js";import{c as S,i as C,l as w,n as T,r as E,s as D,t as O}from"./Item-BnoX9ivc.js";import{t as k}from"./useWarmupSchema-qtEx5UU0.js";var A=a(`globe`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`,key:`13o1zl`}],[`path`,{d:`M2 12h20`,key:`9i4pu4`}]]),j=a(`mail`,[[`path`,{d:`m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7`,key:`132q7q`}],[`rect`,{x:`2`,y:`4`,width:`20`,height:`16`,rx:`2`,key:`izxlao`}]]),M=a(`tag`,[[`path`,{d:`M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z`,key:`vktsd0`}],[`circle`,{cx:`7.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`kqv944`}]]),N=a(`webhook`,[[`path`,{d:`M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2`,key:`q3hayz`}],[`path`,{d:`m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06`,key:`1go1hn`}],[`path`,{d:`m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8`,key:`qlwsc0`}]]),P=n(),F=c(`
  query SchemaInfo($input: JSON!, $type: SchemaType!) {
    schema(input: $input, type: $type) {
      servers {
        url
        description
      }
      license {
        name
        url
        identifier
      }
      termsOfService
      externalDocs {
        description
        url
      }
      contact {
        name
        url
        email
      }
      description
      summary
      title
      url
      version
      tags {
        name
        description
        extensions
      }
      components {
        securitySchemes {
          name
          type
          description
          in
          paramName
          scheme
          bearerFormat
          openIdConnectUrl
          flows {
            implicit {
              authorizationUrl
              scopes {
                name
                description
              }
            }
            password {
              tokenUrl
              scopes {
                name
                description
              }
            }
            clientCredentials {
              tokenUrl
              scopes {
                name
                description
              }
            }
            authorizationCode {
              authorizationUrl
              tokenUrl
              scopes {
                name
                description
              }
            }
          }
        }
      }
      webhooks {
        name
        method
        summary
        description
      }
    }
  }
`),I=({href:e,icon:t,children:n})=>(0,P.jsxs)(`a`,{href:e,className:`inline-flex items-center gap-2 opacity-65 hover:opacity-100 [&_svg]:shrink-0 [&_svg]:size-3.5`,target:`_blank`,rel:`noopener noreferrer`,children:[t,(0,P.jsx)(`span`,{className:`truncate grow-0`,children:n})]}),L=({schema:e})=>{let t=!!(e.license||e.termsOfService||e.externalDocs),n=!!(e.contact?.name||e.contact?.email||e.contact?.url),i=e.servers.length>0;return(0,P.jsxs)(p,{className:`flex flex-col gap-3 text-sm`,children:[t&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[e.license&&(0,P.jsx)(I,{href:e.license.url??void 0,children:e.license.name}),e.termsOfService&&(0,P.jsx)(I,{href:e.termsOfService,children:`Terms of Service`}),e.externalDocs&&(0,P.jsx)(I,{href:e.externalDocs.url,children:e.externalDocs.description??`Documentation`})]}),t&&(n||i)&&(0,P.jsx)(r,{}),n&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,P.jsx)(`span`,{className:`text-xs text-muted-foreground font-medium uppercase tracking-wide`,children:`Contact`}),e.contact?.name&&(0,P.jsx)(`span`,{children:e.contact.name}),e.contact?.email&&(0,P.jsx)(I,{href:`mailto:${e.contact.email}`,icon:(0,P.jsx)(j,{}),children:e.contact.email}),e.contact?.url&&(0,P.jsx)(I,{href:e.contact.url,icon:(0,P.jsx)(A,{}),children:e.contact.url})]}),n&&i&&(0,P.jsx)(r,{}),i&&(0,P.jsxs)(`div`,{className:`flex flex-col gap-1.5`,children:[(0,P.jsx)(`span`,{className:`text-xs text-muted-foreground font-medium uppercase tracking-wide`,children:`Servers`}),e.servers.map(e=>(0,P.jsxs)(`div`,{children:[(0,P.jsx)(`code`,{className:`text-xs select-all break-all`,children:e.url}),e.description&&(0,P.jsx)(`p`,{className:`text-muted-foreground text-xs`,children:e.description})]},e.url))]})]})},R=e=>{switch(e){case`apiKey`:return(0,P.jsx)(d,{size:14});case`http`:return(0,P.jsx)(f,{size:14});case`oauth2`:return(0,P.jsx)(m,{size:14});case`openIdConnect`:return(0,P.jsx)(m,{size:14});case`mutualTLS`:return(0,P.jsx)(f,{size:14})}},z=e=>{switch(e.type){case`apiKey`:return`API Key in ${e.in??`header`} (${e.paramName??`key`})`;case`http`:return e.scheme===`bearer`?`Bearer token${e.bearerFormat?` (${e.bearerFormat})`:``}`:`HTTP ${e.scheme??`authentication`}`;case`oauth2`:return`OAuth 2.0 authorization`;case`openIdConnect`:return`OpenID Connect`;case`mutualTLS`:return`Mutual TLS authentication`}},B=()=>{let{input:n,type:r,options:a}=s(),{data:{schema:c}}=e(o(F,{input:n,type:r})),{title:d,description:p}=c;k();let m=!!(c.contact?.name||c.contact?.email||c.contact?.url||c.servers.length>0||c.license||c.termsOfService||c.externalDocs),A=c.tags.flatMap(({name:e,description:t,extensions:n})=>e?{name:e,description:t,extensions:n}:[]);return(0,P.jsxs)(`div`,{className:`pt-(--padding-content-top)`,"data-pagefind-filter":`section:openapi`,"data-pagefind-meta":`section:openapi`,children:[(0,P.jsx)(w,{name:`category`,children:d}),(0,P.jsxs)(i,{children:[d&&(0,P.jsx)(`title`,{children:d}),p&&(0,P.jsx)(`meta`,{name:`description`,content:p})]}),(0,P.jsxs)(`div`,{className:`mb-8 flex flex-col gap-4`,children:[(0,P.jsx)(S,{heading:d,headingId:`description`}),(0,P.jsxs)(`div`,{className:`grid grid-cols-1 xl:grid-cols-[1fr_minmax(250px,380px)] gap-8`,children:[m&&(0,P.jsx)(`div`,{className:`xl:hidden sticky top-(--top-nav-height) lg:top-(--scroll-padding) z-10 row-start-1 col-start-1 justify-self-end self-start`,children:(0,P.jsxs)(b,{children:[(0,P.jsx)(y,{asChild:!0,children:(0,P.jsx)(g,{variant:`outline`,size:`icon`,className:`shadow-sm rounded-full`,children:(0,P.jsx)(l,{})})}),(0,P.jsx)(v,{align:`end`,className:`xl:hidden w-full max-w-full md:max-w-sm`,children:(0,P.jsx)(L,{schema:c})})]})}),(0,P.jsxs)(`div`,{className:`flex flex-col gap-6 row-start-1 col-start-1`,children:[c.summary&&(0,P.jsx)(`p`,{className:`text-lg text-muted-foreground`,children:c.summary}),c.description&&(0,P.jsx)(_,{className:`prose-img:max-w-prose prose-sm max-w-full lg:max-w-2xl`,content:c.description}),A.length>0&&(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`div`,{className:`flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground mb-4`,children:[(0,P.jsx)(M,{size:14}),`Tags`]}),(0,P.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:A.map(e=>(0,P.jsx)(O,{variant:`outline`,asChild:!0,children:(0,P.jsx)(t,{to:x(e.name),children:(0,P.jsxs)(E,{children:[(0,P.jsx)(D,{children:e.extensions?.[`x-displayName`]??e.name}),e.description&&(0,P.jsx)(C,{asChild:!0,children:(0,P.jsx)(_,{components:{p:({children:e})=>e,a:e=>(0,P.jsx)(`span`,{...e})},content:e.description,className:`prose-sm text-pretty`})})]})})},e.name))})]}),!a?.disableSecurity&&(c.components?.securitySchemes?.length??0)>0&&(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`div`,{className:`flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground mb-4`,children:[(0,P.jsx)(f,{size:14}),`Security Schemes`]}),(0,P.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:c.components?.securitySchemes?.map(e=>(0,P.jsxs)(O,{variant:`outline`,children:[(0,P.jsxs)(E,{children:[(0,P.jsxs)(D,{className:`flex items-center gap-2`,children:[R(e.type),e.name]}),(0,P.jsx)(C,{asChild:!0,children:(0,P.jsx)(_,{content:e.description??z(e),className:`prose-sm text-pretty`,components:{p:({children:e})=>e,a:e=>(0,P.jsx)(`span`,{...e})}})})]}),(0,P.jsx)(T,{children:(0,P.jsx)(u,{variant:`muted`,className:`text-[10px] font-mono`,children:e.type})})]},e.name))})]}),c.webhooks.length>0&&(0,P.jsxs)(`div`,{children:[(0,P.jsxs)(`div`,{className:`flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground mb-4`,children:[(0,P.jsx)(N,{size:14}),`Webhooks`]}),(0,P.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:c.webhooks.map(e=>(0,P.jsxs)(O,{variant:`outline`,children:[(0,P.jsxs)(E,{children:[(0,P.jsx)(D,{children:e.name}),(e.summary||e.description)&&(0,P.jsx)(C,{children:e.summary??e.description})]}),(0,P.jsx)(T,{children:(0,P.jsx)(u,{variant:`muted`,className:`text-[10px] font-mono`,children:e.method})})]},`${e.name}-${e.method}`))})]})]}),m&&(0,P.jsx)(`div`,{className:`hidden xl:block`,children:(0,P.jsx)(h,{className:`sticky top-(--scroll-padding)`,children:(0,P.jsx)(L,{schema:c})})})]})]})]})};export{B as SchemaInfo};
//# sourceMappingURL=SchemaInfo-DhOWsysw.js.map