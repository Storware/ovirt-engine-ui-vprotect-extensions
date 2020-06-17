enum WebadminToastTypeEnum { // TODO: Best as an enum or something else?
  info = 'info',
  danger = 'danger',
}

enum WebadminPlacesEnum { // TODO: Best as an enum or something else?
  dataCenters = 'dataCenters',
  clusters = 'clusters',
  hosts = 'hosts',
  storage = 'storage',
  vms = 'vms',
  events = 'events',
  volumes = 'volumes',
}

export enum EntityType {}
// TODO: Add the entities.

/**
 * The event handler callbacks that a plugin may register with the plugin API.
 */
interface EventHandlers {
  /**
   * Called by the infrastructure as part of plugin initialization. This function will
   * be called just once during the lifetime of a plugin, before WebAdmin calls other
   * event handler functions. This function is a good place for one-time UI extensions
   * and to setup places and action buttons.
   */
  UiInit(): void;

  /**
   * Called after a user logs into WebAdmin.
   *
   * @param userNameWithDomain follows user@domain convention
   * @param userId
   */
  UserLogin(userNameWithDomain: string, userId: string): void;

  /**
   * Called after a user logs out of WebAdmin.
   */
  UserLogout(): void;

  // TODO: Add the other {EntityType}selectionChange functions
}

/**
 * Defines a UI plugin ActionButton renders details and its behavior via callbacks.
 */
interface ActionButtonInterface {
  /**
   * Called when user clicks the button, arguments are items currently selected in
   * given main view, no-op by default
   */
  onClick(...selectedItems: object[]): void;

  /**
   * Called to determine whether the button should be enabled (clickable), arguments
   * are items currently selected in given main view, returns `true` by default
   */
  isEnabled(...selectedItems: object[]): void;

  /**
   * Called to determine whether the button should be accessible (visible), arguments
   * are items currently selected in given main view, returns `true` by default
   */
  isAccessible(...selectedItems: object[]): void;

  /**
   * Where in the existing set of buttons should the plugin's button be inserted?
   */
  index: number;
}

/**
 * oVirt WebAdmin UI plugin integration API.
 *
 * For specific deatails on the plugin architecture and lifecycle, see the
 * [feature page on the ovirt site](https://www.ovirt.org/develop/release-management/features/ux/uiplugins43).
 */
interface OvirtPluginApi {
  // ----- Plugin Life-cycle Functions, "Core functions"
  /**
   * Register your plugin with the API.  API won't activate the plugin
   * until the plugin indicates is it ready by calling `ready()`
   */
  register(registration: EventHandlers): void;

  /**
   * Provides custom API options that affect specific features of plugin API,
   * overriding default API options.  It may be called anytime during the
   * lifetime of a plugin.
   */
  options(apiOptions: { allowedMessageOrigins: string | string[] }): void;

  /**
   * Tell the API that the app is ready to proceed with plugin initialization,
   * calling `UiInit` event handler function (if defined) as soon as the plugin
   * invocation context is entered.
   *
   * The `register` function must be called before calling this function otherwise
   * this function will have no effect.
   */
  ready(): void;

  // ----- Accessor Functions
  /**
   * Returns user name and domain of currently logged in user, following user@domain convention.
   */
  loginUserName(): string;

  /**
   * Return the UUID of currently logged in user.
   */
  loginUserId(): string;

  /**
   * Returns the locale that has been selected by the user when they logged in. The
   * locale is return in xx_YY format (e.g. 'en_US' or 'ja_JP').
   */
  currentLocale(): string;

  /**
   * Returns the base URL of the engine. This is useful if you wish to access some of
   * the engines CSS classes or other services.
   */
  engineBaseURL(): string;

  /**
   * Returns an SSO token which can be used to authenticate the current user against
   * the engine. This may be used to authenticates to the REST api.
   */
  ssoToken(): string;

  /**
   * Returns the runtime plugin configuration object containing any custom
   * configuration merged on top of any available default configuration.
   */
  configObject(): any;

  // ----- Action Functions
  /**
   * Show a new toast notification managed by WebAdmin
   *
   * @param type 'info' or 'danger'
   * @param message Message to be shown on the toast
   */
  showToast(type: WebadminToastTypeEnum, message: string): void;

  /**
   * Reveals the given standard or plugin-contributed main tab application place
   *
   * @param historyToken The place's `#historyToken` in the application URL
   */
  revealPlace(historyToken: WebadminPlacesEnum | string): void;

  /**
   * Applies the given search string to the currently active main view place.
   *
   * @param search Text to apply into the currently active place search panel
   */
  setSearchString(search: string): void;

  // ----- Main Views and Detail Tabs
  /**
   * Adds new primary menu place with content provided from given URL.  Primary menu
   * places cannot have secondary menu items, only primary menu containers can.
   *
   * @param label Text displayed in the primary menu
   * @param historyToken Unique indentified of the place, with its value reflected in browser
   *                     URL (recommend format `letter-with-dashes`)
   * @param contentUrl passed to `src` attribute of `iframe` element which renders the place content
   * @param options TODO: document options object
   */
  addPrimaryMenuPlace(
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: {
      priority?: number;
      defaultPlace?: boolean;
      icon?: string;
    },
  ): void;

  /**
   * Adds new primary menu container that allows for secondary menu places.
   *
   * @param label Text displayed in the primary menu
   * @param primaryMenuId a plugin provided identifier that allows plugins to pass that
   *                      identifier to `addSecondaryMenuPlace`, so the infra structure
   *                      knows which primary container to add the secondary menu place to.
   * @param options TODO: document options object
   */
  addPrimaryMenuContainer(
    label: string,
    primaryMenuId: string,
    options?: {
      priority?: number;
      icon?: string;
    },
  ): void;

  /**
   * Adds new secondary menu place with content provided from given URL.
   *
   * @param primaryMenuId Primary menu container you want the secondary menu to appear in
   * @param label Text displayed in the secondary menu
   * @param historyToken Unique identifier of the place, with its value reflected in browser
   *                     URL (recommend format `letter-with-dashes`)
   * @param contentUrl passed to `src` attribute of the `iframe` element which renders the place content
   * @param options TODO: document options object
   */
  addSecondaryMenuPlace(
    primaryMenuId: string,
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: {
      priority?: number;
    },
  ): void;

  /**
   * Adds a new detail place with content provided from given URL.
   *
   * @param entityTypeName Entity type this detail place is associated with
   * @param label Text displayed in the place.  The label specifies the label of the
   *              detail tab that is associated with the place of the `historyToken`.
   * @param historyToken Unique identifier of the place, with its value reflected in browser
   *                     URL (recommend format `letter-with-dashes`)
   * @param contentUrl passed to `src` attribute of the `iframe` element which renders the place content
   * @param options TODO: document options object
   */
  addDetailPlace(
    entityTypeName: EntityType,
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: {
      priority?: number;
    },
  ): void;

  /**
   * Updates the content URL of a given place.
   *
   * @param historyToken Unique identifier of the place, with its value reflected in browser
   *                     URL (recommend format `letter-with-dashes`)
   * @param contentUrl passed to `src` attribute of the `iframe` element which renders the place content
   */
  setPlaceContentUrl(historyToken: string, contentUrl: string): void;

  /**
   * Controls the accessibility of a given place.  This function works only for places
   * added via plugin API.
   *
   * @param historyToken Unique identifier of the place, with its value reflected in browser
   *                     URL (recommend format `letter-with-dashes`)
   * @param placeAccessible If `placeAccessible` is `false`, corresponding menu item or tab
   *    header will be hidden in WebAdmin UI and attempts to reveal the given tab manually
   *    by manipulating URL will be denied.
   */
  setPlaceAccessible(historyToken: string, placeAccessible: boolean): void;

  /**
   * Adds new button to the action panel and context menu for the given main view
   * associated with the entityTypeName.
   *
   * @param entityTypeName Entity type this detail place is associated with
   * @param label Text displayed on button
   * @param actionButtonInterface Overrides button behavior
   */
  addMenuPlaceActionButton(
    entityTypeName: EntityType,
    label: string,

    actionButtonInterface: ActionButtonInterface,
  ): void;

  /**
   * Adds new button to the action panel and context menu for the given detail tab.
   *
   * @param mainEntityTypeName
   * @param detailEntityTypeName
   * @param label Text displayed on button
   * @param actionButtonInterface
   */
  addDetailPlaceActionButton(
    mainEntityTypeName: EntityType,
    detailEntityTypeName: EntityType,
    label: string,

    actionButtonInterface: ActionButtonInterface,
  ): void;
}

/**
 * Returns a reference to the WebAdmin UI plugin integration API.
 */
declare function getPluginApi(): OvirtPluginApi;
export default getPluginApi;
