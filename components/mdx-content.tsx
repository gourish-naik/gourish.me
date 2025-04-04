/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX } from 'react'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high';

import Counter from '@/components/counter'

function Code({ children, ...props }: any) {
    const codeHTML = highlight(children)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  }
  
  const components = {
    code: Code,
    Counter
  }

export default function MDXContent(
  props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
    return (
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
