/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX } from 'react'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import Counter from '@/components/counter'
import { highlight } from 'sugar-high';

function Code({ children, ...props }: any) {
    const codeHTML = highlight(children)

    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const components = {
    code: Code,
    Counter,
    h3: (props: any) => (
        <h3{...props} className='text-teal-300'>
            {props.children}
        </h3>
    )
}

export default function MDXContent(props: JSX.IntrinsicAttributes & MDXRemoteProps) {
    return (
        <MDXRemote
            {...props}
            components={{ ...components, ...(props.components || {}) }}
        />
    )
}
