extension_name := deref
extension_uuid := jgn@cnil.fr

ZIP := zip

bin_dir := ./bin
src_dir := ./src
build_dir := $(bin_dir)/build

xpi_file := $(bin_dir)/$(extension_name).xpi


.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

.PHONY: clean
clean:
	@rm -rf $(build_dir)
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

xpi_built :=manifest.json \
			$(wildcard icons/*.png) \
			$(wildcard src/*.html) \
			$(wildcard src/*.js) 

.PHONY: install
install: $(build_dir) $(xpi_built)
	@echo "Installing in profile folder: $(profile_location)"
	@cp -Rf $(build_dir)/* $(profile_location)
	@echo "Installing in profile folder. Done!"
	@echo


$(xpi_file): $(xpi_built)
	@echo "Creating XPI file."
	@$(ZIP) $(xpi_file) $(xpi_built)
	@echo "Creating XPI file. Done!"
