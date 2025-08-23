import React, { useEffect, useRef } from "react";
import { ManageItemsForm } from "./ManageItemsForm.jsx"; 
import TableView from "../../../components/TableView.jsx";
import TableEntity from "../../../components/TableEntity.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setFixedId, setId, setName, setState } from "../reducers/itemForm.js";
import { setItems } from "../reducers/items.js";
import Header from "../../../components/Header/Header.jsx";
import { getAllItems } from "../services/items.js";
export const ItemsPage = ()=>
{
  const dispatch = useDispatch()

  const bottomRef = useRef(null);

  const items = useSelector(state => state.items)
  const formState = useSelector(state => state.itemForm.state)

  const getAllItems_ = async()=> 
  {
    const items = await getAllItems();
    if(items.state) dispatch(setItems(items.data));
  }

  useEffect(()=>
  {
    if(bottomRef.current)
    {
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [items])

  useEffect(()=>
  {
    getAllItems_()
  }, [])

  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const itemId = tr.getAttribute('data-id');
    const itemName = tr.getAttribute('data-name');
    const itemFixedId = tr.getAttribute('data-fixed-id');
    dispatch(setId(itemId));
    dispatch(setName(itemName));
    dispatch(setFixedId(itemFixedId));
    if(!formState) return;
    dispatch(setState(false));
  }

  return(
    <>
      <div className="sticky top-[0px] z-10">
        <Header/>
        <ManageItemsForm legend={'إنشاء/تعديل صنف'} />
      </div>
      <TableView heads={["كود", "الصنف"]} onClick={onClickEntity}>
        {
          items.map(({internalId, body})=> {
            let data = {
              'data-id': body.id,
              'data-name': body.name,
              'data-fixed-id': internalId
            }
            return <TableEntity key={body.id} data={[body.id, body.name]} dataHeader={data} customTailwind={'hover:bg-gray-100'}/>
          })
        }
      </TableView>
      <span ref={bottomRef}></span>
    </>
  )
}