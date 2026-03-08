
import Banner from '../../components/home/Banner'
import JoinCom from "../../components/home/JoinCom"
import JustTake from '../../components/home/JustTake'
import Philosophy from '../../components/home/JoinCom'
import React from 'react'
import ShopBy from '../../components/home/ShopBy'
import Bestsellers from './bestsellers/page'
import Newarrive from './newarival/page'

export default function page() {
  return (
      <div>
      <Banner></Banner>
      <Bestsellers></Bestsellers>
      <ShopBy></ShopBy>
      <Newarrive></Newarrive>
      <Philosophy></Philosophy>
      <JustTake></JustTake>
      <JoinCom></JoinCom>
    </div>
  )
}