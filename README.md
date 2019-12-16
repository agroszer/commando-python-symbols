# commando-python-symbols

This adds a new search scope to Commando allowing you to easily access your python symbols in the current file.

Install
=======

Open Commando Packages, type Python Symbol Scope and press Enter to install it.

Building
========

To build the Python Symbol Scope please refer to the documentation on building an extension:

$ Komodo-IDE-11/lib/sdk/bin/koext build --unjarred

Debug
=====

in the JS console you can run

`require("ko/logging").getLogger("commando-python-symbols").setLevel(10);`

and that will start dumping debug logging to Help > Troubleshooting > View Log File
