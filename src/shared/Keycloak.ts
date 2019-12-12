import Keycloak from 'keycloak-connect';

export class KeycloakMiddleware {

    private static keycloak: Keycloak;

    private static init(): void {
        KeycloakMiddleware.keycloak = new Keycloak({});
    }

    public static getInstance(): Keycloak {
        if (!KeycloakMiddleware.keycloak) {
            KeycloakMiddleware.init();
        }

        return KeycloakMiddleware.keycloak;
    }

}
