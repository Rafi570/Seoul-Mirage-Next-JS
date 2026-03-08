
import Banner from '../../components/home/Banner'
import JoinCom from "../../components/home/JoinCom"
import JustTake from '../../components/home/JustTake'
import Philosophy from '../../components/home/JoinCom'
import React from 'react'

export default function page() {
  return (
      <div>
      <Banner></Banner>
      <Philosophy></Philosophy>
      <JustTake></JustTake>
      <JoinCom></JoinCom>
    </div>
  )
}