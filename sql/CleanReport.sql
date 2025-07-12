create database `db_cleaning_report`;

-- ユーザテーブル
create table `users` (
  id         int          not null auto_increment primary key comment "ユーザID",
  first_name varchar(255) not null comment "名前",
  last_name  varchar(255) not null comment "苗字",
  email      varchar(255) not null comment "メールアドレス",
  position   varchar(255)          comment "役職",
  status     varchar(2)   not null comment "未確認/確認済み",
  password   varchar(255) not null comment "パスワード"
);



-- 清掃タイプテーブル
create table `cleaning_type` (
  id        int          not null auto_increment primary key comment "清掃タイプID",
  type_name varchar(255) not null comment "タイプ名"
);

-- 清掃エリアテーブル
create table `cleaning_area` (
  id        int          not null auto_increment primary key comment "清掃エリアID",
  type_id   int          not null comment "清掃タイプID",
  area_name varchar(255) not null comment "エリア名"
);

-- 清掃箇所テーブル
create table `cleaning_spot` (
  id       int          not null auto_increment primary key comment "清掃箇所ID",
  location varchar(255)          comment "清掃箇所"
);

-- チェックリストテーブル
create table `checklist` (
  id      int          not null auto_increment primary key comment "チェックリストID",
  area_id  int          not null comment "清掃エリアID",
  spot_id int          not null comment "清掃箇所ID",
  item    varchar(255) not null comment "チェック項目"
);


-- 業務報告書テーブル
create table `clean_report` (
  id             int        not null auto_increment primary key comment "レポートID",
  user_id        int        not null comment "担当者ID",
  sub_user_id    int                 comment "担当者ID",
  area_id        int        not null comment "清掃場所ID",
  start_datetime datetime   not null comment "作業開始日時",
  end_datetime   datetime   not null comment "作業完了日時",
  status         varchar(2) not null comment "未確認/確認済み"
);

-- 写真テーブル
create table `photo` (
  id              int          not null auto_increment primary key comment "写真ID",
  report_id       int          not null comment "レポートID",
  photo_url       varchar(255) not null comment "写真URL",
  posted_datetime datetime     not null comment "アップロード日時"
);

-- 所要時間テーブル
create table `location_time` (
  id            int          not null auto_increment primary key comment "所要時間ID",
  report_id     int          not null comment "レポートID",
  task_name     varchar(255) not null comment "タスク名",
  required_time time         not null comment "所要時間"
);
