const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./createServer-CzpABend.js","./chunk-CilyBKbf.js","./preload-helper-Chd9yIcd.js","./constants-BmrImgVR.js","./slugify-BVr6s_qz.js","./OasProvider-_Dg7TfER.js","./joinUrl-Bra5o9kv.js","./useBaseQuery-D_noWDJe.js","./jsx-runtime-BcqRK4R-.js","./react-C7HJXoYM.js","./OperationList-BHNfPLLH.js","./react-nprogress.esm-Dt2I5IlG.js","./dist-JIhJ9dwh.js","./Button-CnInqkBo.js","./dist-GEjsMXa-.js","./cn-DagfQA4x.js","./Textarea-Xs1Jf-WY.js","./DropdownMenu-B_fKayxm.js","./dist-CsryzUdt.js","./es2015-BnS2wNtg.js","./createLucideIcon-Da3dwJUI.js","./useQuery-B1JGNr1Q.js","./utils-vOl3HOFD.js","./Dialog-BqQhRuXR.js","./x-JpOIkq2a.js","./PlaygroundDialog-3PGgGHZh.js","./Select-W2ConDxT.js","./dist-BReU16el.js","./copy-DmtCOk43.js","./Popover-DDzmvFZB.js","./Markdown-BC32-LbF.js","./lib-C2cyKK4t.js","./shiki-DfQZcmfV.js","./lib-C-T33wHC.js","./shiki-constants-Cf-LcvS2.js","./Typography-C0Io7PrU.js","./useHighlighter-Cyj-tZG7.js","./eye-CdWsqysF.js","./Card-p1W2iDsK.js","./dist-BlMUqyNU.js","./Alert-BD0XdXUU.js","./Collapsible-WJGtPzjJ.js","./SyntaxHighlight-DTGRxe1P.js","./CodeBlock-BhvZjZTB.js","./useCopyToClipboard-BjDjcVmr.js","./CategoryHeading-CO9HpbDH.js","./dist-BQrWGJhK.js","./Pagination-D7jF6BOR.js","./SchemaView-B5TRhzre.js","./Badge-CTUZ8sjA.js","./InlineCode-Ca7y5-rp.js","./Item-BnoX9ivc.js","./AiAssistantMenuItems-CdSev0aT.js","./Callout-m7rq3fO-.js","./useWarmupSchema-qtEx5UU0.js","./SchemaList-DoiW6WqI.js","./Toc-C8NcwUoc.js","./useScrollToAnchor-Dn4ebC8Y.js","./SchemaInfo-DhOWsysw.js","./PlaygroundDialog-D-BvLNsd.js"])))=>i.map(i=>d[i]);
import{r as e}from"./chunk-CilyBKbf.js";import{t}from"./react-C7HJXoYM.js";import{t as n}from"./preload-helper-Chd9yIcd.js";import{_ as r,a as i,f as a,m as o,n as s,t as c,u as l,x as u}from"./joinUrl-Bra5o9kv.js";import{t as d}from"./jsx-runtime-BcqRK4R-.js";import{t as f}from"./createLucideIcon-Da3dwJUI.js";import{t as p}from"./Button-CnInqkBo.js";var m=f(`circle-play`,[[`path`,{d:`M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z`,key:`kmsa83`}],[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}]]),h=class extends Error{developerHint;title;constructor(e,{developerHint:t,title:n,cause:r}={}){super(e,{cause:r}),this.name=`ZudokuError`,this.title=n,this.developerHint=t}},g,_={},v=e=>{if(e.errors?.[0])throw new h(e.errors[0].message,{developerHint:"Check your configuration value `apis.type` and `apis.input` in the Zudoku config."})},y=class{config;constructor(e){e.schemaImports&&Object.assign(_,e.schemaImports),this.config=e}#e=async()=>(g||=n(()=>import(`./createServer-CzpABend.js`).then(e=>e.createServer({...this.config,schemaImports:_})),__vite__mapDeps([0,1,2,3,4]),import.meta.url),g);#t=async e=>this.config.server?fetch(this.config.server,e):(await this.#e()).fetch(`http://localhost/graphql`,e);fetch=async(e,t)=>{let n=e.match(/query (\w+)/)?.[1],r=await this.#t({method:`POST`,body:JSON.stringify({query:e,variables:t,operationName:n}),headers:{"Content-Type":`application/json`}});if(!r.ok)throw Error(`Network response was not ok`);let i=await r.json();return v(i),i.data}},b=e(t(),1),x=d(),S=(0,b.createContext)(void 0),C=({children:e,client:t})=>(0,x.jsx)(S.Provider,{value:t,children:e}),w=(e,t,...[n])=>({queryFn:()=>e.fetch(t,n),queryKey:[t.toString().replace(/\s+/g,` `).trim(),n]}),T=(e,...[t])=>{let n=(0,b.use)(S);if(n===void 0)throw Error(`useGraphQL must be used within a GraphQLProvider`);return w(n,e,...t===void 0?[]:[t])},E=class extends String{__apiType;value;__meta__;constructor(e,t){super(e),this.value=e,this.__meta__=t}toString(){return this.value}},D=new E(`
    fragment OperationsFragment on OperationItem {
  slug
  summary
  method
  description
  operationId
  contentTypes
  path
  deprecated
  extensions
  servers {
    url
    description
  }
  parameters {
    name
    in
    description
    required
    schema
    style
    explode
    allowReserved
    examples {
      name
      description
      externalValue
      value
      summary
    }
  }
  security {
    schemes {
      scopes
      scheme {
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
  }
  requestBody {
    content {
      mediaType
      encoding {
        name
      }
      examples {
        name
        description
        externalValue
        value
        summary
      }
      schema
    }
    description
    required
  }
  responses {
    statusCode
    links
    description
    content {
      examples {
        name
        description
        externalValue
        value
        summary
      }
      mediaType
      encoding {
        name
      }
      schema
    }
  }
}
    `,{fragmentName:`OperationsFragment`}),O={"\n  query ServersQuery($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      url\n      servers {\n        url\n      }\n    }\n  }\n":new E(`
    query ServersQuery($input: JSON!, $type: SchemaType!) {
  schema(input: $input, type: $type) {
    url
    servers {
      url
    }
  }
}
    `),"\n  fragment OperationsFragment on OperationItem {\n    slug\n    summary\n    method\n    description\n    operationId\n    contentTypes\n    path\n    deprecated\n    extensions\n    servers {\n      url\n      description\n    }\n    parameters {\n      name\n      in\n      description\n      required\n      schema\n      style\n      explode\n      allowReserved\n      examples {\n        name\n        description\n        externalValue\n        value\n        summary\n      }\n    }\n    security {\n      schemes {\n        scopes\n        scheme {\n          name\n          type\n          description\n          in\n          paramName\n          scheme\n          bearerFormat\n          openIdConnectUrl\n          flows {\n            implicit {\n              authorizationUrl\n              scopes {\n                name\n                description\n              }\n            }\n            password {\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n            clientCredentials {\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n            authorizationCode {\n              authorizationUrl\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n          }\n        }\n      }\n    }\n    requestBody {\n      content {\n        mediaType\n        encoding {\n          name\n        }\n        examples {\n          name\n          description\n          externalValue\n          value\n          summary\n        }\n        schema\n      }\n      description\n      required\n    }\n    responses {\n      statusCode\n      links\n      description\n      content {\n        examples {\n          name\n          description\n          externalValue\n          value\n          summary\n        }\n        mediaType\n        encoding {\n          name\n        }\n        schema\n      }\n    }\n  }\n":D,"\n  query OperationsForTag(\n    $input: JSON!\n    $type: SchemaType!\n    $tag: String\n    $untagged: Boolean\n  ) {\n    schema(input: $input, type: $type) {\n      servers {\n        url\n      }\n      description\n      summary\n      title\n      url\n      version\n      tag(slug: $tag, untagged: $untagged) {\n        name\n        description\n        operations {\n          slug\n          ...OperationsFragment\n        }\n        extensions\n        next {\n          name\n          slug\n          extensions\n        }\n        prev {\n          name\n          slug\n          extensions\n        }\n      }\n    }\n  }\n":new E(`
    query OperationsForTag($input: JSON!, $type: SchemaType!, $tag: String, $untagged: Boolean) {
  schema(input: $input, type: $type) {
    servers {
      url
    }
    description
    summary
    title
    url
    version
    tag(slug: $tag, untagged: $untagged) {
      name
      description
      operations {
        slug
        ...OperationsFragment
      }
      extensions
      next {
        name
        slug
        extensions
      }
      prev {
        name
        slug
        extensions
      }
    }
  }
}
    fragment OperationsFragment on OperationItem {
  slug
  summary
  method
  description
  operationId
  contentTypes
  path
  deprecated
  extensions
  servers {
    url
    description
  }
  parameters {
    name
    in
    description
    required
    schema
    style
    explode
    allowReserved
    examples {
      name
      description
      externalValue
      value
      summary
    }
  }
  security {
    schemes {
      scopes
      scheme {
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
  }
  requestBody {
    content {
      mediaType
      encoding {
        name
      }
      examples {
        name
        description
        externalValue
        value
        summary
      }
      schema
    }
    description
    required
  }
  responses {
    statusCode
    links
    description
    content {
      examples {
        name
        description
        externalValue
        value
        summary
      }
      mediaType
      encoding {
        name
      }
      schema
    }
  }
}`),"\n  query SchemaInfo($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      servers {\n        url\n        description\n      }\n      license {\n        name\n        url\n        identifier\n      }\n      termsOfService\n      externalDocs {\n        description\n        url\n      }\n      contact {\n        name\n        url\n        email\n      }\n      description\n      summary\n      title\n      url\n      version\n      tags {\n        name\n        description\n        extensions\n      }\n      components {\n        securitySchemes {\n          name\n          type\n          description\n          in\n          paramName\n          scheme\n          bearerFormat\n          openIdConnectUrl\n          flows {\n            implicit {\n              authorizationUrl\n              scopes {\n                name\n                description\n              }\n            }\n            password {\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n            clientCredentials {\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n            authorizationCode {\n              authorizationUrl\n              tokenUrl\n              scopes {\n                name\n                description\n              }\n            }\n          }\n        }\n      }\n      webhooks {\n        name\n        method\n        summary\n        description\n      }\n    }\n  }\n":new E(`
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
    `),"\n  query GetSchemas($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      title\n      description\n      summary\n      components {\n        schemas {\n          name\n          schema\n          extensions\n        }\n      }\n    }\n  }\n":new E(`
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
    `),"\n  query getServerQuery($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      url\n      servers {\n        url\n      }\n    }\n  }\n":new E(`
    query getServerQuery($input: JSON!, $type: SchemaType!) {
  schema(input: $input, type: $type) {
    url
    servers {
      url
    }
  }
}
    `),"\n  query GetNavigationOperations($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      extensions\n      tags {\n        slug\n        name\n        extensions\n        operations {\n          summary\n          slug\n          method\n          operationId\n          path\n        }\n      }\n      components {\n        schemas {\n          __typename\n        }\n      }\n    }\n  }\n":new E(`
    query GetNavigationOperations($input: JSON!, $type: SchemaType!) {
  schema(input: $input, type: $type) {
    extensions
    tags {
      slug
      name
      extensions
      operations {
        summary
        slug
        method
        operationId
        path
      }
    }
    components {
      schemas {
        __typename
      }
    }
  }
}
    `),"\n  query SchemaWarmup($input: JSON!, $type: SchemaType!) {\n    schema(input: $input, type: $type) {\n      openapi\n    }\n  }\n":new E(`
    query SchemaWarmup($input: JSON!, $type: SchemaType!) {
  schema(input: $input, type: $type) {
    openapi
  }
}
    `)};function k(e){return O[e]??{}}var A=({tagCategories:e,tagGroups:t,expandAllTags:n})=>{let r=new Set,i=t.flatMap(t=>{let i=e.get(t.name),a=i?.type===`category`?i:void 0;a&&r.add(t.name);let o=t.tags.flatMap(n=>{if(n===t.name)return[];let i=e.get(n);return i?(r.add(n),i):[]});return!a&&o.length===0?[]:{...a,type:`category`,label:a?.label??t.name,items:[...a?.items??[],...o],collapsible:a?.collapsible??!0,collapsed:a?.collapsed??!n}}),a=Array.from(e.entries()).filter(([e])=>!r.has(e)).map(([,e])=>e);return[...i,...a]},j={get:`green`,post:`blue`,put:`yellow`,delete:`red`,patch:`purple`,options:`gray`,head:`gray`},M=({label:e,path:t,operations:n,collapsible:r,collapsed:i})=>({type:`category`,label:e,link:{type:`doc`,path:t,file:t,label:e},collapsible:r,collapsed:i,items:n.map(e=>({type:`link`,label:e.summary??e.path,to:`${t}#${e.slug}`,badge:{label:e.method,color:j[e.method.toLowerCase()],invert:!0}}))}),N=(0,b.createContext)(void 0),P=N.Provider,F=()=>{let e=(0,b.useContext)(N);if(!e)throw Error(`useOasConfig must be used within a OasConfigProvider`);return e.config},I=e=>({path:e.routePath,async lazy(){let{OasProvider:t}=await n(async()=>{let{OasProvider:e}=await import(`./OasProvider-_Dg7TfER.js`);return{OasProvider:e}},__vite__mapDeps([5,1,6,2,7,8,9]),import.meta.url);return{element:(0,x.jsx)(t,{basePath:e.basePath,version:e.version,client:e.client,config:e.config})}},children:e.routes}),L=({path:e,tag:t,untagged:r})=>({path:e,async lazy(){let{OperationList:e}=await n(async()=>{let{OperationList:e}=await import(`./OperationList-BHNfPLLH.js`);return{OperationList:e}},__vite__mapDeps([10,1,2,11,12,13,14,15,8,9,16,17,18,19,20,21,7,6,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,3,4,53,54]),import.meta.url);return{element:(0,x.jsx)(e,{tag:t,untagged:r})}}}),R=({render:e,path:t})=>{let{type:n,input:a}=F(),{tag:o}=u(),c=r(),{data:{schema:d}}=s(T(K,{type:n,input:a})),f=d.tags.at(0);return!o&&f?.slug?(0,x.jsx)(i,{to:{pathname:l(t,{tag:f.slug}),search:c.search}}):o&&d.tags.some(e=>e.slug===o)?e(o):null},z=({path:e})=>({path:e,async lazy(){let{OperationList:t}=await n(async()=>{let{OperationList:e}=await import(`./OperationList-BHNfPLLH.js`);return{OperationList:e}},__vite__mapDeps([10,1,2,11,12,13,14,15,8,9,16,17,18,19,20,21,7,6,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,3,4,53,54]),import.meta.url);return{element:(0,x.jsx)(R,{path:e,render:e=>(0,x.jsx)(t,{tag:e})})}}}),B=({basePath:e,hasUntaggedOperations:t=!0})=>[...t?[L({path:c(e,q),untagged:!0})]:[],{path:c(e,`~schemas`),lazy:async()=>{let{SchemaList:e}=await n(async()=>{let{SchemaList:e}=await import(`./SchemaList-DoiW6WqI.js`);return{SchemaList:e}},__vite__mapDeps([55,17,1,12,13,14,15,8,9,18,19,20,45,6,2,7,48,26,27,28,16,21,22,30,31,32,33,34,35,36,37,49,50,51,52,44,3,4,56,57,24,41]),import.meta.url);return{element:(0,x.jsx)(e,{})}}}],V=({versionPath:e,tagPages:t,hasUntaggedOperations:r=!0,showInfoPage:i=!0})=>{let a=t.at(0)??(r?`~endpoints`:void 0);return[i?{index:!0,path:e,lazy:async()=>{let{SchemaInfo:e}=await n(async()=>{let{SchemaInfo:e}=await import(`./SchemaInfo-DhOWsysw.js`);return{SchemaInfo:e}},__vite__mapDeps([58,13,1,14,15,8,9,29,17,12,18,19,20,45,6,2,7,30,31,32,33,34,22,21,35,36,49,38,51,26,27,28,52,44,54,4]),import.meta.url);return{element:(0,x.jsx)(e,{})}}}:a?{index:!0,loader:()=>o(c(e,a))}:L({path:e}),...t.map(t=>L({path:c(e,t),tag:t})),...B({basePath:e,hasUntaggedOperations:r})]},H=e=>e.type===`raw`||!Array.isArray(e.input)?{versions:[],versionMap:{}}:{versions:e.input.map(e=>e.path),versionMap:Object.fromEntries(e.input.map(e=>[e.path,{label:e.label??e.path,downloadUrl:e.downloadUrl,tagPages:e.tagPages}]))},U=(e,t)=>t&&(!e.tagPages||e.tagPages.includes(t))?c(e.path,t):e.path,W=({basePath:e,config:t,client:n})=>{let r=t.tagPages,{versions:i}=H(t),a=Array.isArray(t.input)?t.input:void 0;return(i.length>1?[void 0,...i]:[void 0]).map(i=>{let o=c(e,i),s=i?a?.find(e=>e.path===i):a?.[0],l=s?.hasUntaggedOperations??!0,u=s?.tagPages??r;return I({basePath:e,version:i,routePath:o,routes:u?V({versionPath:o,tagPages:u,hasUntaggedOperations:l,showInfoPage:t.options?.showInfoPage!==!1}):[z({path:`${o}/:tag?`}),...B({basePath:o,hasUntaggedOperations:l})],client:n,config:t})})},G=(0,b.lazy)(()=>n(()=>import(`./PlaygroundDialog-D-BvLNsd.js`).then(e=>({default:e.PlaygroundDialog})),__vite__mapDeps([59,25,1,11,12,13,14,15,8,9,16,17,18,19,20,21,7,6,2,22,23,24,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44]),import.meta.url)),K=k(`
  query GetNavigationOperations($input: JSON!, $type: SchemaType!) {
    schema(input: $input, type: $type) {
      extensions
      tags {
        slug
        name
        extensions
        operations {
          summary
          slug
          method
          operationId
          path
        }
      }
      components {
        schemas {
          __typename
        }
      }
    }
  }
`),q=`~endpoints`,J=e=>{let t=c(e.path),n=new y(e);return{getHead:()=>{if(e.type===`url`&&!e.skipPreload)return(Array.isArray(e.input)?e.input.map(e=>e.input):[e.input]).map(e=>(0,x.jsx)(`link`,{href:e,rel:`preload`,as:`fetch`,crossOrigin:`anonymous`},e));if(e.server)return(0,x.jsx)(`link`,{rel:`preconnect`,href:e.server})},getMdxComponents:()=>({OpenPlaygroundButton:({server:e,method:t=`get`,url:n=`/`,children:r,...i})=>{if(!e)throw Error(`Server is required`);return(0,x.jsx)(b.Suspense,{children:(0,x.jsx)(G,{url:n,method:t,server:e,...i,children:(0,x.jsx)(p,{className:`gap-2 items-center`,variant:`outline`,children:r??(0,x.jsxs)(x.Fragment,{children:[`Open in Playground`,(0,x.jsx)(m,{size:16,"aria-hidden":`true`})]})})})})}}),getNavigation:async(r,i)=>{if(!a({path:t,end:!1},r))return[];try{let{versions:o}=H(e),s=o.find(e=>a({path:c(t,e),end:!1},r)),l=s??o.at(0),{type:u}=e,d=w(n,K,{type:u,input:Array.isArray(e.input)?e.input.find(e=>e.path===l)?.input??e.input[0]?.input:e.input}),f=await i.queryClient.ensureQueryData(d),p=A({tagCategories:new Map(f.schema.tags.filter(e=>e.name&&e.operations.length>0).map(n=>{if(!n.name)throw Error(`Tag ${n.slug} has no name`);let r=c(t,s,n.slug),i=n.extensions?.[`x-zudoku-collapsed`]??!e.options?.expandAllTags,a=n.extensions?.[`x-zudoku-collapsible`]??!0;return[n.name,M({label:n.extensions?.[`x-displayName`]??n.name,path:r,operations:n.operations,collapsed:i,collapsible:a})]})),tagGroups:f.schema.extensions?.[`x-tagGroups`]??[],expandAllTags:e.options?.expandAllTags});e.options?.showInfoPage!==!1&&p.unshift({type:`link`,to:c(t,s),label:`Information`});let m=f.schema.tags.find(e=>!e.name)?.operations;return m&&m.length>0&&p.push(M({label:p.length===0?`Endpoints`:`Other endpoints`,path:c(t,s,q),operations:m,collapsed:!e.options?.expandAllTags})),f.schema.components?.schemas?.length&&p.push({type:`link`,label:`Schemas`,to:c(t,s,`~schemas`)}),p}catch{return[]}},getRoutes:()=>W({basePath:t,config:e,client:n})}};export{P as a,T as c,H as i,C as l,J as n,F as o,U as r,k as s,q as t,h as u};
//# sourceMappingURL=openapi-C6WKIbip.js.map