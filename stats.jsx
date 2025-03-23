// Sample code available on GitHub: https://github.com/kurmasz-SampleCode/CIS371-SampleCode
// Based on an example from Learning React, 2nd Edition by Porcello and Banks.
// This example is in ReactRecipe/recipe1.jsx

// const { useState } = require("react");

const data = [{
    type: "song",
    value: "possum",
    stat: "times played",
    by: "all"
},
{
    type: "venue",
    value: "van andel arena",
    stat: "times played",
    by: "all"
},
{
    type: "song",
    value: "twist",
    stat: "per state",
    by: "michigan"
},
];

function Stat(props) {
    return <li> 
        {props.type}    {props.value}   {props.stat}    {props.by}  
        <button className="button" onClick={() => props.edit(props.index)}>Edit</button>
        <button className="button" onClick={() => props.delete(props.index)}>Delete</button>
    </li>
    
}

function StatList(props) {
    return <ul className="stats" > 
        <li>Type:   Value:  Stat:   By:</li>    
        {props.stats.map((item, index) => (
            <Stat type={item.type} value={item.value} stat={item.stat} by={item.by} key={index} index={index} edit={props.edit} delete={props.delete} />
        ))}
    </ul>
}

function Instructions(props) {
    return <div className='instructions'>
        <h3>Instructions</h3>
        {props.steps.map((step, index) => (<p key={index}>{step}</p>))}
    </div>;
}

function Entries(props) {
    return <div className= 'entries'>
        <StatList stats={props.stats} edit= {props.edit} delete= {props.delete} />
    </div>;
}

function Entry(props) {
    return <div className='entry'>
                <h2>{props.editIdx !== null ? "Edit Stat:" : "New Stat"}</h2>
                <div className='field'>
                    <label>Type:</label>
                    <input type="text" name="type" value={props.entryData.type} onChange={props.change}></input>
                </div>
                <div className='field'>
                    <label>Value:</label>
                    <input type="text" name="value" value={props.entryData.value} onChange={props.change}></input>
                </div>
                <div className='field'>
                    <label>Stat:</label>
                    <input type="text" name="stat" value={props.entryData.stat} onChange={props.change}></input>
                </div>
                <div className='field'>
                    <label>By:</label>
                    <input type="text" name="by" value={props.entryData.by} onChange={props.change}></input>
                </div>
                <button className="button" onClick={props.button}>{props.editIdx !== null ? "Update" : "Create"}</button>
            </div>;
}

function Menu(props) {
    const [entryData, setEntryData] = React.useState({
        type: "",
        value: "",
        stat: "",
        by: ""
    });

    const [entries, setEntries] = React.useState(data);
    const [editIdx, setEditIdx] = React.useState(null);

    const updateEntry = (entry) => {
        setEntryData({...entryData, [entry.target.name]: entry.target.value});
    };

    const submit = () => {
        if (editIdx !== null) {
            const updated = [...entries];
            updated[editIdx] = entryData;
            setEntries(updated);
            setEditIdx(null);
        }
        else {
            setEntries([...entries, entryData]);
        }

        setEntryData({
            type: "",
            value: "",
            stat: "",
            by: ""
        });
    };

    const edit = (idx) => {
        setEntryData(entries[idx]);
        setEditIdx(idx);
    };

    const remove = (idx) => {
        const updated = [...entries];
        updated.splice(idx, 1);
        setEntries(updated);
    }

    return <section className='page'>
        <Entry entryData= {entryData} editIdx= {editIdx} change= {updateEntry} button= {submit} />
        <Entries stats={entries} edit= {edit} delete= {remove}/>
    </section>;
}

ReactDOM.render(
    <Menu stats={data} title="Stat Requests" />,
    document.getElementById("main")
);
 