export const MY_API_URL = "http://localhost:3000/another";

// チェックリストテンプレートの型定義
interface ChecklistTemplate {
  title: string;
  data: {
    [section: string]: string[];
  };
}

// DB関連の型定義
interface CleaningArea {
  id: number;
  type_name: string;
  area_name: string;
}

interface CleaningSpot {
  id: number;
  area_id: number;
  location: string;
}

interface ChecklistItem {
  id: number;
  spot_id: number;
  item: string;
}

// DBからエリアID取得
export const getAreaIdByName = async (typeName: string, areaName: string): Promise<number | null> => {
  try {
    console.log("エリアID取得開始:", typeName, areaName);
    
    const response = await fetch(`${MY_API_URL}/cleaning_area`);
    const data: CleaningArea[] = await response.json();
    
    console.log("cleaning_area データ:", data);
    
    // 配列を直接処理
    if (!data || !Array.isArray(data)) {
      console.error("不正なcleaning_areaデータ:", data);
      return null;
    }
    
    const targetArea = data.find((area: CleaningArea) => 
      area.type_name === typeName && area.area_name === areaName
    );
    
    console.log("該当エリア:", targetArea);
    return targetArea ? targetArea.id : null;
    
  } catch (err) {
    console.error("エリアID取得エラー:", err);
    return null;
  }
};

// DBからチェックリスト取得
export const fetchChecklistTemplate = async (areaId: number): Promise<ChecklistTemplate> => {
  try {
    console.log("チェックリスト取得開始 areaId:", areaId);
    
    // cleaning_spot 取得
    const spotResponse = await fetch(`${MY_API_URL}/cleaning_spot`);
    const spotData: CleaningSpot[] = await spotResponse.json();
    console.log("cleaning_spot データ:", spotData);
    
    // checklist 取得
    const checklistResponse = await fetch(`${MY_API_URL}/checklist`);
    const checklistData: ChecklistItem[] = await checklistResponse.json();
    console.log("checklist データ:", checklistData);
    
    // エリア名取得
    const areaResponse = await fetch(`${MY_API_URL}/cleaning_area`);
    const areaData: CleaningArea[] = await areaResponse.json();
    const area = areaData.find((a: CleaningArea) => a.id === areaId);
    
    // データ構築
    const template: ChecklistTemplate = {
      title: area ? area.area_name : "チェックリスト",
      data: {}
    };
    
    // 該当エリアのスポットを取得
    const areaSpots = spotData.filter((spot: CleaningSpot) => spot.area_id === areaId);
    console.log("該当エリアのスポット:", areaSpots);
    
    // 各スポットのチェックリスト項目を取得
    areaSpots.forEach((spot: CleaningSpot) => {
      const spotItems = checklistData
        .filter((item: ChecklistItem) => item.spot_id === spot.id)
        .map((item: ChecklistItem) => item.item);
      
      if (spotItems.length > 0) {
        template.data[spot.location] = spotItems;
      }
    });
    
    console.log("構築されたテンプレート:", template);
    return template;
    
  } catch (err) {
    console.error("チェックリスト取得エラー:", err);
    return { title: "エラー", data: {} };
  }
};

// 静的データをフォールバック用に保持
export const ChecklistTemplates: { [key: string]: ChecklistTemplate } = {
  tenjin: {
    title: "民泊清掃 - 天神 -",
    data: {
      リビング: [
        "リネン交換　綺麗に伸びているか",
        "床　埃、髪の毛がない",
        "洗濯機　蓋に汚れがない",
        "洗濯機　フィルター2箇所汚れなし",
        "洗濯機　洗剤入ってる",
        "テーブル　汚れがない",
        "テーブルの上に銀のクロス",
        "テレビ地デジになっている",
        "プロジェクターWIFIつながってる",
        "エアコン消えてる",
        "ソファー　汚れがない",
        "寝室　カーテンまとめる",
        "ヨギボー汚れがない",
        "ハンガーラック全て右に寄せる",
        "ゴミが全て回収されている",
      ],
      お風呂: [
        "窓しまってる",
        "浴槽　汚れがない",
        "浴槽内排水溝カチッと音がするまではまってる",
        "排水溝　排水溝の蓋　髪の毛がない",
        "シャンプー・コンディショナー・ボディーソープ補充",
        "拭き上げ",
        "洗濯機上に歯ブラシ・タオル・フェイスタオルを人数分セット",
        "浴室マットラックの1番下に干す",
        "床に髪の毛、汚れがない",
        "ハンガー全部左に寄せる",
      ],
      キッチン: [
        "排水口　ゴミがない",
        "排水溝は穴が奥",
        "電子レンジ　汚れがない",
        "ポット中にないも入ってない",
        "ポット外側汚れがない",
        "冷蔵庫・冷凍庫の中何もない",
        "冷蔵庫・冷凍庫内汚れがない",
        "ミニタオルが設置されている",
        "空気清浄機水が入ってない",
        "空気清浄機電源が入ってない",
        "ゴミ箱綺麗に袋がつけてある",
        "リモコン類　テレビリモコン　プロジェクターリモコン　エアコンのリモコン　ボールペン　単三電池2個がある",
        "給湯器電源がが入っている",
        "クイックルワイパー新しいものがついている",
        "窓しまってる",
      ],
      トイレ: [
        "便器に汚れがない",
        "便座 に汚れがない",
        "床 に汚れがない",
        "ペーパーホルダー汚れがない",
        "トイレットペーパー半分以下になったら交換",
        "窓閉まってる",
        "トイレットペーパー、ティッシュペーパーのストックが補充されている",
      ],
      洗面台: [
        "ドライヤー下のカゴになおす",
        "排水溝　髪の毛がない",
        "鏡・洗面ボウル　汚れがない",
        "ハンドソープ補充されている",
      ],
      照明: ["常時点灯以外の電気を消す"],
      玄関: [
        "棚に汚れがない",
        "玄関汚れがない",
        "スリッパが人数分ある",
        "紙スリッパが人数分ある",
        "消化器埃がない",
        "カーテン開けて固定されている",
        "傘立てに傘が２本ある",
      ],
      外: [
        "洗濯物はコインランドリー",
        "忘れ物はラックの2段目",
        "ゴミはラックの1番下",
        "使った雑巾はラックの上2段",
      ],
    },
  },
  junkai: {
    title: "巡回清掃",
    data: {}, // チェックリストなし
  },
  harukichi: {
    title: "民泊清掃 - 春吉 -", 
    data: {
      全体のゴミ回収: [
        "全体のゴミ回収"
      ],
      リビング: [
        "リネン交換　綺麗に伸びているか",
        "灰皿　汚れがない",
        "床　埃、髪の毛がない",
        "テーブル　汚れがない",
        "テーブルの上に説明書その上にリモコン",
        "テレビ　ホームになっている",
        "WIFIつながる",
        "リモコンがつかえる",
        "ソファー　汚れがない",
        "寝室　カーテン閉める",
        "リビング　白カーテンだけ閉める",
      ],
      お風呂: [
        "浴槽　汚れがない",
        "排水溝　排水溝の蓋　髪の毛がない",
        "シャンプー・コンディショナー・ボディーソープ補充",
        "拭き上げ",
        "洗濯機上にタオル・フェイスタオルを人数分セット",
      ],
      キッチン: [
        "排水口　ゴミがない",
        "排水溝は穴が奥",
        "電子レンジ　汚れがない",
        "ポット中にないも入ってない",
        "冷蔵庫・冷凍庫の中何もない",
      ],
      トイレ: [
        "便器",
        "便座",
        "床",
        "ペーパーホルダーの拭き上げ",
        "トイレットペーパー半分以下になったら交換",
      ],
      脱衣所洗面台: [
        "ドライヤー整頓",
        "排水溝　髪の毛がない",
        "鏡・洗面ボウル　汚れがない",
      ],
      照明: ["リビングと玄関の照明つける"],
      玄関: ["汚れがない"],
    },
  },
  shisetsu: {
    title: "施設清掃",
    data: {
      トイレ: [
        "トイレ上洗面台　水垢がない",
        "トイレ上洗面台　蛇口の裏汚れなし",
        "トイレ上洗面台　蛇口に硬化した水垢がない",
        "タンク　汚れがない",
        "水のハンドル　汚れがない",
        "タンクと便器の間　汚れなし",
        "便器蓋　便座　汚れがない",
        "便器内　黒ずみがない",
        "便器内　縁汚れがない",
        "便器側面　汚れがない",
        "便器下　汚れがない",
        "ペーパーホルダー　汚れなし",
        "タオルホルダー　汚れなし",
        "換気扇　汚れなし",
        "タンクしたパイプ　汚れがない",
        "トイレ収納　汚れない",
        "巾木　汚れがない",
        "ドア表裏　汚れがない",
        "ドア縁　汚れがない",
        "床　汚れ　埃がない",
      ],
      洗面台: [
        "小物入れ　汚れ埃がない",
        "鏡　汚れ埃がない",
        "洗面ボウル内　水垢、汚れがない",
        "蛇口　水垢がない",
        "蛇口裏　硬化した水垢がない",
        "排水溝　汚れがない",
        "洗面台下収納　汚れがない",
      ],
      部屋: [
        "巾木上　埃が乗ってない",
        "巾木表面　汚れがない",
        "照明　中に虫がいない、汚れがない",
        "スイッチ類　汚れがない",
        "カーテンレール上　埃がない",
        "角　埃が溜まってない",
        "ドア　汚れがない",
        "窓　汚れがない",
        "窓サッシ　汚れがない",
        "エアコン　汚れがない",
      ],
      床: ["ワックスムラがない", "埃、髪の毛がない"],
    },
  },
  house: {
    title: "ハウスクリーニング",
    data: {
      玄関: [
        "黒ずみがない",
        "髪の毛、ゴミが落ちていない",
        "巾木に汚れがない",
        "靴箱に汚れがない",
        "ドア表裏取れる汚れは残ってない",
      ],
      浴室: [
        "天井　汚れがない",
        "蛇口　水垢がない",
        "蛇口　裏固まった水垢がない",
        "鏡　鱗がない",
        "浴槽　石鹸カスがない",
        "浴槽内排水溝　汚れなし",
        "排水溝　汚れなし",
        "ドアガラス　曇りがない",
        "ドアレール　固まった水垢かない",
        "ドア下部　固まった水垢がない",
        "入り口サッシ　汚れがない",
        "ドア上　汚れがない",
        "壁　石鹸カス、汚れがない",
        "床　黒ずみがないか",
      ],
      トイレ: [
        "トイレ上洗面台　水垢がない",
        "トイレ上洗面台　蛇口の裏汚れなし",
        "トイレ上洗面台　蛇口に硬化した水垢がない",
        "タンク　汚れがない",
        "水のハンドル　汚れがない",
        "タンクと便器の間　汚れなし",
        "便器蓋　便座　汚れがない",
        "便器内　黒ずみがない",
        "便器内　縁汚れがない",
        "便器側面　汚れがない",
        "便器下　汚れがない",
        "ペーパーホルダー　汚れなし",
        "タオルホルダー　汚れなし",
        "換気扇　汚れなし",
        "タンクしたパイプ　汚れがない",
        "トイレ収納　汚れない",
        "巾木　汚れがない",
        "ドア表裏　汚れがない",
        "ドア縁　汚れがない",
        "床　汚れ　埃がない",
      ],
      洗面台: [
        "小物入れ　汚れ埃がない",
        "鏡　汚れ埃がない",
        "洗面ボウル内　水垢、汚れがない",
        "蛇口　水垢がない",
        "蛇口裏　硬化した水垢がない",
        "排水溝　汚れがない",
        "洗面台下収納　汚れがない",
      ],
      洗濯パン: [
        "蛇口　汚れがない",
        "洗濯パン　汚れがない",
        "排水溝　汚れがない",
      ],
      キッチン: [
        "レンジフード　油汚れがない",
        "レンジフードフィルター　油汚れがない",
        "レンジフード蓋　汚れがない",
        "シロッコファン　汚れがない",
        "キッチン上収納　汚れがない",
        "キッチン壁　汚れがない",
        "コンロ・五徳　コゲがない",
        "シンク内　水垢がない",
        "蛇口裏　硬化した水垢がない",
        "蛇口　光ってる",
        "排水溝　汚れがない",
        "キッチン下収納　汚れがない",
        "キッチングリル　汚れない",
        "キッチン下スペース　汚れなし",
      ],
      部屋: [
        "巾木上　埃が乗ってない",
        "巾木表面　汚れがない",
        "照明　中に虫がいない、汚れがない",
        "スイッチ類　汚れがない",
        "カーテンレール上　埃がない",
        "角　埃が溜まってない",
        "ドア　汚れがない",
        "窓　汚れがない",
        "窓サッシ　汚れがない",
        "エアコン　汚れがない",
      ],
      床: ["ワックスムラがない", "埃、髪の毛がない"],
    },
  },
};

// 新しい動的取得関数
export const getTemplateByTypeAndLocation = async (type: string, location: string): Promise<ChecklistTemplate> => {
  try {
    console.log("テンプレート取得開始:", type, location);
    
    // DBからエリアID取得
    const areaId = await getAreaIdByName(type, location);
    
    if (areaId) {
      // DBからチェックリスト取得
      const template = await fetchChecklistTemplate(areaId);
      console.log("DB取得成功:", template);
      return template;
    } else {
      console.log("エリアIDが見つからない、フォールバック使用");
      // フォールバック：静的データ使用
      if (type === "民泊清掃") {
        if (location === "天神民泊") return ChecklistTemplates.tenjin;
        if (location === "春吉民泊") return ChecklistTemplates.harukichi;
      }
      if (type === "巡回清掃") return ChecklistTemplates.junkai;
      if (type === "施設清掃") return ChecklistTemplates.shisetsu;
      if (type === "ハウスクリーニング") return ChecklistTemplates.house;
      
      return ChecklistTemplates.tenjin; // デフォルト
    }
  } catch (err) {
    console.error("テンプレート取得エラー:", err);
    // エラー時は静的データにフォールバック
    console.log("エラー時フォールバック使用");
    return ChecklistTemplates.tenjin;
  }
};