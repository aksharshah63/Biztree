<template>
  <div>
    <div class="p-1 d-flex flex-d-column justify-around">
      <div class="h-100 shape-rounded w-100 bg-dark-sub4">
        <h5 class="font-w-400 text-gray4 p-05">
          {{ $t("myStorage") }}
        </h5>
        <div>
          <bib-progress max="15 GB" :indicator="$formatBytes(storageValue)" :value="(100 * (storageValue / (1024 * 1024)).toFixed(2)) / 15360"></bib-progress>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from "../config/i18n";
export default {
  name: "Dashboard",
  auth: false,
  data() {
    return {
      filesKey: 0,
      searchCount: 0,
      sortKey: 0,
      previewkey: 0,
      moreMenuKey: 0,
      folderClass: "",
      controlOnStart: true,
      filesDropped: [],
      foldersDropped: [],
      showNotification: false,
      showSpinner: false,
      showDescInput: false,
      showFolderMenu: false,
      showSortMenu: false,
      showSidePanel: false,
      showFileMenu: false,
      showUserMenu: false,
      showMoreMenu: false,
      showSearchCount: false,
      collapseNavigation: true,
      showDetailsPreview: false,
      currentUser: {},
      draggedFolder: {},
      currentFolder: { _id: "root", name: this.$i18n.t("myDrive") },
      createdFolder: {},
      showFileSectionMenu: false,
      showLoader: false,
      notificationText: "",
      notificationVariant: "",
      sortMenuActions: {
        items: [
          {
            label: this.$i18n.t("name"),
            method: "sortBy",
            params: ["name", "asc"],
            icon_right: "long-arrow-up",
            variant: "white",
            event: "sort-by-name",
          },
          {
            label: this.$i18n.t("dateModified"),
            method: "sortBy",
            params: ["updatedAt", "asc"],
            icon_right: "long-arrow-up",
            variant: "white",
            event: "sort-by-date",
          },
          {
            label: this.$i18n.t("size"),
            method: "sortBy",
            params: ["size", "asc"],
            icon_right: "long-arrow-up",
            variant: "white",
            event: "sort-by-size",
          },
          {
            label: this.$i18n.t("file-format"),
            method: "sortBy",
            params: ["extension", "asc"],
            icon_right: "long-arrow-up",
            variant: "white",
            event: "sort-by-format",
            separator: true,
          },
          {
            label: this.$i18n.t("reset"),
            method: "sortBy",
            params: ["reset", "asc"],
            event: "sort-reset",
          },
        ],
      },
      moreMenuActions: {
        items: [
          {
            label: this.$i18n.t("showDetails"),
            method: "",
            params: [],
            event: "show-details",
            separator: true,
          },
          {
            label: this.$i18n.t("uploadToFolder") + "...",
            method: "openUploadFileModal",
            params: [],
            icon_left: "upload",
            variant: "gray5",
            event: "upload-to-folder",
          },
          {
            label: this.$i18n.t("download"),
            method: "",
            params: [],
            icon_left: "download",
            variant: "gray5",
            event: "download",
          },
          {
            label: this.$i18n.t("addToFavorites"),
            method: "favoriteFolder",
            params: [],
            icon_left: "heart",
            variant: "gray5",
            event: "add-favorites",
          },
          {
            label: this.$i18n.t("shareWith"),
            method: "",
            params: [],
            icon_left: "user-add",
            variant: "gray5",
            event: "share-with",
          },
          {
            label: this.$i18n.tc("conversations", 2),
            method: "",
            showFunc: true,
            params: [],
            icon_left: "reply",
            variant: "gray5",
            event: "conversations",
          },
          {
            label: this.$i18n.t("rename"),
            method: "",
            params: [],
            icon_left: "pencil",
            variant: "gray5",
            event: "rename",
          },
          {
            label: this.$i18n.t("copy"),
            method: "",
            params: [],
            icon_left: "duplicate",
            variant: "gray5",
            event: "copy",
          },
          {
            label: this.$i18n.t("paste"),
            method: "",
            params: [],
            icon_left: "copy-file",
            variant: "gray5",
            event: "paste",
          },
          {
            label: this.$i18n.t("moveTo"),
            method: "",
            params: [],
            icon_left: "transfer",
            variant: "gray5",
            event: "move-to",
          },
          {
            label: this.$i18n.t("report"),
            method: "",
            params: [],
            icon_left: "warning",
            variant: "gray5",
            event: "report",
            separator: true,
          },
          {
            label: this.$i18n.t("delete"),
            method: "openDeleteFolderModal",
            params: [],
            event: "sort-reset",
          },
        ],
      },
      appHeaderActions: {
        button: {
          label: this.$i18n.t("create") + " / " + this.$i18n.t("upload"),
          event: "button-click",
          variant: "success",
          icon: "add",
        },
        select: {
          items: [
            {
              label: "Organization #01",
              event: "item-click",
              img: "https://i.pravatar.cc/300",
            },
            {
              label: "Organization #02",
              event: "item-click",
              img: "https://i.pravatar.cc/300",
            },
          ],
          footer: {
            label: this.$i18n.t("addOrganization"),
            icon: "plus",
            event: "add-organization",
          },
        },
      },
      contextFile: {
        name: "",
        description: "",
      },
      contextFolder: {},
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      selectedFile: {
        name: "",
        type: "",
        extension: "",
        type: "",
        description: "",
      },
      fileInfoTabs: [this.$i18n.t("details"), this.$i18n.t("sharing"), this.$i18n.tc("conversations", 1), this.$i18n.t("history")],
      activeFileInfoTab: "details",
      navItems2: [
        { label: this.$i18n.t("sharedWithMe"), icon: "nodes" },
        { label: this.$i18n.t("sharedByMe"), icon: "user-org-chart" },
        { label: this.$i18n.t("recent"), icon: "time" },
        { label: this.$i18n.t("favorites"), icon: "heart" },
        { label: this.$i18n.t("docsTemplates"), icon: "layers" },
        { label: this.$i18n.t("trash"), icon: "trash" },
      ],
      nav: {
        title: this.$i18n.t("myDrive"),
        backLink: { name: this.$i18n.t("myDrive"), _id: "root" },
        bread: [{ name: this.$i18n.t("myDrive"), _id: "root" }],
      },
      parent: "",
      viewGrid: "Board",
      toolbarActions: {
        items: [
          {
            label: this.$i18n.t("newDocument"),
            method: "",
            icon_left: "add",
            variant: "success",
            event: "new-document",
          },
          {
            label: this.$i18n.t("newSpreadsheet"),
            method: "",
            icon_left: "add",
            variant: "primary",
            event: "new-spreadsheet",
          },
          {
            label: this.$i18n.t("newFolder"),
            method: "openCreateFolderModal",
            icon_left: "folder-solid",
            variant: "gray5",
            event: "create-folder",
            separator: true,
          },
          {
            label: this.$i18n.t("uploadFile"),
            method: "openUploadFileModal",
            icon_left: "file",
            variant: "gray5",
            event: "upload-file",
          },
          {
            label: this.$i18n.t("uploadFolder"),
            method: "openUploadFolderModal",
            icon_left: "folder-solid",
            variant: "gray5",
            event: "upload-folder",
          },
        ],
      },
      appItems: [
        {
          img: "Layers",
          color: "primary",
          active: false,
          text: "Templates",
          href: "#",
        },
        {
          img: "Files",
          color: "success-sub1",
          active: true,
          text: "Files",
          href: "#",
        },
        {
          img: "Signature",
          color: "orange",
          active: false,
          text: "eSign",
          href: "#",
        },
        {
          img: "Tick",
          color: "primary",
          active: false,
          text: "Project",
          href: "#",
        },
        {
          img: "CommentForum",
          color: "purple",
          active: false,
          text: "Chat",
          href: "#",
        },
      ],
      page: {
        title: this.$i18n.t("myDrive"),
      },
      folder: {
        name: "",
      },
      fields: [
        {
          key: "_v",
          label: "#",
        },
        {
          key: "name",
          label: this.$i18n.t("fileName"),
        },
        {
          key: "type",
          label: this.$i18n.t("fileType"),
        },
        {
          key: "owner",
          label: this.$i18n.t("fileOwner"),
        },
        {
          key: "date",
          label: this.$i18n.t("added") + "/" + this.$i18n.t("modified"),
        },
      ],
    };
  },
};
</script>
<style lang="scss"></style>
