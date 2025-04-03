'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MinusIcon, PlusIcon } from 'lucide-react'


export default function Counter() {
    const [count, setCount] = useState(0)
    const increment = () => setCount(count + 1)
    const decrement = () => {
        if (count == 0) { return null }
        else { setCount(count - 1) }
    }
    return (
        <>
            <div className='flex items-center gap-3'>
                <Button size='icon' onClick={decrement}>
                    <MinusIcon />
                </Button>
                <p>Current vote:{count}</p>
                <Button size='icon' onClick={increment}>
                    <PlusIcon />
                </Button>
            </div>
        </>
    )
}
