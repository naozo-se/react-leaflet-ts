import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import * as _TL from "./const/test-location"
import * as _LC from "./utils/leaflet-commons"
import { point } from "./interface/map";
import L, { LatLngExpression } from "leaflet";

import { LocationOn } from '@mui/icons-material'
import ReactDOMServer from "react-dom/server";


// マテリアルアイコンのタグ情報を変数化
const locationIconTag = (
  <LocationOn />
)

// アイコン情報に変換（現在地）
const currentIcon = L.divIcon({
  html: ReactDOMServer.renderToStaticMarkup(locationIconTag),
  className: 'current-icon',
  iconSize: [40, 40] 
});

// アイコン情報に変換（特定の場所情報）
const locationIcon = L.divIcon({
  html: ReactDOMServer.renderToStaticMarkup(locationIconTag),
  className: 'location-icon',  
  iconSize: [40, 40] 
});

const App = () => {
  // キー設定
  const [mapKey, setMapKey] = useState<number>(0);
  // 現在地情報
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  });
  // 場所情報
  const [placeData, setPlaceData] = useState<point[]>([]);

  // 初期処理
  useEffect(() => {
    moveCurrentPosition();
    setPlaceData([..._TL.tempPlaceData1]);
  }, []);

  // 現在地に移動
  const moveCurrentPosition = async () => {
    const location: GeolocationPosition = await _LC.getCurrentPosition();
    setCurrentPosition({
      ...currentPosition,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    // キーを設定して、再表示
    setMapKey(new Date().getTime());
  };

  // 検索処理
  const getLocationList = () => {
    // データ設定
    setPlaceData([..._TL.tempPlaceData2]);
    // 本当はfetchとかしてデータ取ってくる
    // const responce = await axios.get("http://localshot:8000/api/getLocation/...");
    // setPlaceData([...responce]);
  };

  return (
    <>
      {/* ボタン(機能操作) */}
      <header>
        <button onClick={() => moveCurrentPosition()}>現在地</button>
        <button onClick={() => getLocationList()}>検索</button>
      </header>
      {/* 地図表示 */}
      <MapContainer
        key={mapKey}
        center={currentPosition}
        zoom={_LC.mapOption.startZoom}
      >
        {/* 地図のタイル情報 */}
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright";>OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={_LC.mapOption.maxZoom}
          minZoom={_LC.mapOption.minZoom}
        />
        {/* 現在地情報を出力 */}
        <Marker position={currentPosition} icon={currentIcon}>
          <Popup>現在地</Popup>
        </Marker>
        {/* 場所情報を出力 */}
        {placeData.length > 0
          ? placeData.map((item) => (
              <Marker key={item.id} position={item.latlng} icon={locationIcon}>
                <Popup>{item.placeName}</Popup>
              </Marker>
            ))
          : null}
      </MapContainer>
    </>
  );
};

export default App;