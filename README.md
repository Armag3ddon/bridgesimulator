# bridgesimulator
not yet

# Configuration
To change configuration values, create a config.json file in the server's main directory. When running the server without a config file, you will get a warning in the log. Mainly because this means that you haven't changed the default passwords and every client can easily get administrator privileges and change server settings.

A custom configuration makes it possible to move around certain directories as you see fit. The default configuration fallback will always be in /internal/defaults.json.

The most basic config files should at least have your own custom administrator password and could look like this:
```
{
	"admin_password": "CorrectHorseBatteryStaple!"
}
```

Here is a list of all config options:

| Config option | Default value | Description |
| --- | --- | --- |
| static_directory | /static | The directory where all the static files are placed. Static files are all files that will just be served from the server like CSS, JavaScript, fonts or image files. |
| language_directory | /locales | The directory where all the language files (JSON) are located on the server. |
| scenario_directory | /scenarios | The directory where all scenario folders are located on the server. |
| core_directory | /core | The directory containing all core JSON definitions for color schemes, fonts and basic game scenes. |
| custom_directory | /custom | The directory containing all custom JSON definitions that append or override the core files. |
| pug_directory | /views | The directory containing the .pug-files used by the template rendering engine to create dynamic .html pages. |
| autodetect_languages | true | Either true or false. If true, the server will scan the language directory for available languages and automatically fill the language list that clients can choose from.
| languages_available | [] | Only used when autodetect_languages is false. Must be a JavaScript Array filled with Strings of available languages. E.g. ["en", "de"]. |
| server_port | 5000 | The port that the server will operate on. Clients will need to append this port on the server URL in order to connect, e.g. http://www.coolgameserver.com:5000. |
| server_password | "" | The password clients must enter when connecting to the server. If empty (""), any client can connect and play. |
| server_language | "en" | The default language that the server operates under. Must be one of the available languages. |
| admin_password | "bridgesimulator" | The administrator password that clients must enter when they want to change the server configuration such as what scenario will be played. Administrator will also be able to kick or ban players. It is recommended to not leave the default password. |