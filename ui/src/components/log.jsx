import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import useUrbitStore from '../store'
import '@urbit/sigil-js'


// real time add

export const Log = () => {
    const { urbit, log, hexagrams, oracle, setOracle, setLog } = useUrbitStore()
    const [feed, setFeed] = useState('~zod')

    // const getShipLog = async () => {
    //     return urbit.scry({
    //     app: 'yijing',
    //     path: `/log/~${urbit.ship}`,
    //     })
    // };

    const getLog = async () => {
        return urbit.scry({
        app: 'yijing',
        path: `/log`,
        })
    };

    useEffect(() => {
        const getLogs = async () =>  {
            //   setShipLog((await getShipLog())[`~${urbit.ship}`])
              setLog(await getLog())
              setFeed(`~${urbit.ship}`)
        }
        urbit && getLogs()
        setOracle({})
      }, [urbit]);
    
    console.log('ship', urbit?.ship)
    log && console.log('log', log)

    return (
        <>
            <main>
                <br/>
                {!oracle?.position ? <table>
                    <thead>
                        <tr>
                            <th colSpan={6}>
                                {/* <span>
                                    <button className={feed === `~${urbit?.ship}` ? 'reverse' : ''}
                                        onClick={()=> setFeed(`~${urbit?.ship}`)}>{`~${urbit?.ship}`} 
                                    </button>
                                  </span> */}
                                { Object.keys(log).map((l,i) => {
                                // if (feed !== l)
                                return (
                                    <span key={i}>
                                        <button className={feed === l ? 'reverse' : ''}
                                            onClick={()=> setFeed(l)}>{l} 
                                        </button>&nbsp;&nbsp;
                                    </span>
                                )
                            })}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>who</th>
                            <th>when</th>
                            <th>position</th>
                            <th>intention</th>
                            <th>momentum</th>
                        </tr>
                        {log[feed]?.map((s,i) => {
                            var when = new Date(s.when);
                            return (
                                <tr className='hover' onClick={()=> setOracle(s)} tkey={i}>  
                                    <td>
                                    <urbit-sigil {...{ point: feed, 
                                                       size: 28,
                                                       space:'none',
                                                    }}
                                     />
                                    </td>
                                    <td>
                                            {`${when.toLocaleTimeString("en-US")}`}   <br></br>
                                            {`${when.toLocaleDateString("en-US")}`}   
                                    </td> 
                                    <td style={{fontSize: '32px'}}>
                                        {hexagrams[s.position-1]?.hc || s.position}
                                    </td>    
                                
                                    <td>
                                        {s.intention}
                                    </td> 
                                    <td style={{fontSize: '32px'}}>
                                        {hexagrams[s.momentum]?.hc || s.momentum}
                                    </td> 
                                </tr>
                        )})}
                    </tbody>
                </table>
                : <div className='oracle'>
                    <button className='hover' onClick={() => setOracle({})}>[ X ]</button><br/><br/>
                    <div>Intention: {oracle.intention}</div><p/>
                    <div>Position: {oracle.position-1}</div><p/>
                    <div style={{fontSize:'64px'}}>{hexagrams[oracle.position-1].hc}</div><p/>
                    <div>{hexagrams[oracle.position-1].c} -  {hexagrams[oracle.position-1].nom}</div><p/>
                    <div>Judgement: {hexagrams[oracle.position-1].jud}</div><p/>
                    <div>Image: {hexagrams[oracle.position-1].img}</div><p/>
                    {oracle.changing.length > 0 && <div><div>Changing Lines: 
                    {oracle.changing?.map(o => {return <p>Line {o}: {hexagrams[oracle.position-1][`l${o}`]}</p>})} </div>
                    <p/>
                    <div>Momentum: {oracle.momentum-1}</div><p/>
                    <div style={{fontSize:'64px'}}>{hexagrams[oracle.momentum-1].hc}</div><p/>
                    <div>{hexagrams[oracle.momentum-1].c} - {hexagrams[oracle.momentum-1].nom}</div><p/>
                    <div>Judgement: {hexagrams[oracle.momentum-1].jud}</div><p/>
                    </div>}
                </div>}
                <br/><br/>
            </main>
            <Link onClick={()=>setOracle({})} className='nav'  to="/apps/yijing/">[cast]</Link>
        </>
    )
}